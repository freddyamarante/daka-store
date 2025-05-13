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
  maxPrice: number
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
    maxPrice: 1000
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
        this.maxPrice = Math.max(...this.products.map(p => p.price))
        
      } catch (error) {
        console.error('Error fetching data:', error)
        throw error
      }
    },
  },
  getters: {
    filteredProducts: (state) => (filters: { category: string; min: number; max: number }) => {
      return state.products.filter(p => {
        const matchCategory = filters.category === 'all' || p.category === filters.category
        const matchPrice = p.price >= filters.min && p.price <= filters.max
        return matchCategory && matchPrice
      })
    }
  }
})