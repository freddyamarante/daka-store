import axios from 'axios'
import { defineStore } from 'pinia'
import type { Product } from "../types";

interface AppState { 
  exchangeRate: number
  exchangeDatetime: { date: string; time: string }
  displayOptions: {
    showBothPrices: boolean
    selectedCurrency: 'USD' | 'Bs'
  }
  products: Product[]
  categories: string[]
  filterOptions: {
    selectedCategories: string[]
    minPrice: number
    maxPrice: number
  }
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    exchangeRate: 0,
    exchangeDatetime: { date: '', time: '' },
    displayOptions: {
      showBothPrices: true,
      selectedCurrency: 'USD'
    },
    products: [],
    categories: [],
    filterOptions: {
      selectedCategories: [],
      minPrice: 0,
      maxPrice: 1000,
    }
  }),
  actions: {
    async fetchInitialData() {
      try {
        const [productsRes, categoriesRes, rateRes] = await Promise.all([
          axios.get('https://fakestoreapi.com/products'),
          axios.get('https://fakestoreapi.com/products/categories'),
          axios.get('https://pydolarve.org/api/v2/dollar?page=alcambio&format_date=default&rounded_price=true')
        ])

        this.products = productsRes.data
        this.categories = categoriesRes.data
        this.exchangeRate = parseFloat(rateRes.data?.monitors?.bcv?.price) || 0
        this.exchangeDatetime = {
          date: rateRes.data?.datetime?.date || '',
          time: rateRes.data?.datetime?.time || '',
        }
        this.filterOptions.minPrice = Math.min(...this.products.map(p => p.price))
        this.filterOptions.maxPrice = Math.max(...this.products.map(p => p.price))
        
      } catch (error) {
        console.error('Error fetching data:', error)
        throw error
      }
    },
  },
  getters: {
    filteredProducts: (state) => (filters: { categories?: string[]; min?: number; max?: number } = {}) => {
      const { categories = [], min = 0, max = Infinity } = filters;
      return state.products.filter(p => {
          const matchCategory = categories.length === 0 || categories.includes(p.category);
          const matchPrice = p.price >= min && p.price <= max;
          return matchCategory && matchPrice;
      });
    },
    stats: (state) => {
      const store = useAppStore();
      const filteredProducts = store.filteredProducts({ 
          categories: state.filterOptions.selectedCategories,
          min: state.filterOptions.minPrice,
          max: state.filterOptions.maxPrice
      });
      return {
        totalProducts: filteredProducts.length,
        uniqueCategories: new Set(filteredProducts.map(p => p.category)).size,
        averagePrice: filteredProducts.reduce((acc, p) => acc + p.price, 0) / filteredProducts.length || 0,
      };
    },
  }
})