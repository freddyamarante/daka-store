<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import type Product from './types'
import ProductList from './components/ProductList.vue'

const products = ref<Product[]>([])
const categories = ref<string[]>([])
const exchangeRate = ref(0)
const exchangeDatetime = ref<{ date: string, time: string }>({
  date: '',
  time: ''
})
const currentPage = ref(1)
const selectedCategory = ref('all')
const minPrice = ref(0)
const maxPrice = ref(1000)
const loading = ref(true)
const error = ref('')


onMounted(async () => {
  try {
    const [productsRes, categoriesRes, rateRes] = await Promise.all([
      axios.get('https://fakestoreapi.com/products'),
      axios.get('https://fakestoreapi.com/products/categories'),
      axios.get('https://pydolarve.org/api/v2/dollar?page=alcambio&format_date=default&rounded_price=true')
    ])

    products.value = productsRes.data
    categories.value = categoriesRes.data
    exchangeDatetime.value = {
      date: rateRes.data.datetime.date,
      time: rateRes.data.datetime.time,
    }
    exchangeRate.value = rateRes.data.monitors.bcv.price

    maxPrice.value = Math.max(...products.value.map(p => p.price))
  } catch (err) {
    error.value = 'Error cargando datos'
  } finally {
    loading.value = false
    console.log('Products:', products.value)
    console.log('Categories:', categories.value)
    console.log('Exchange Rate:', exchangeRate.value)
  }
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCategory = selectedCategory.value === 'all' || p.category === selectedCategory.value
    const matchPrice = p.price >= minPrice.value && p.price <= maxPrice.value
    return matchCategory && matchPrice
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * 5
  return filteredProducts.value.slice(start, start + 5)
})

const stats = computed(() => ({
  totalProducts: filteredProducts.value.length,
  uniqueCategories: new Set(filteredProducts.value.map(p => p.category)).size,
  averagePrice: filteredProducts.value.reduce((acc, p) => acc + p.price, 0) / filteredProducts.value.length || 0
}))

</script>

<template>
  <div class="space-y-8">
    <div>
      <h2>Debug Info</h2>

      <div>
        <h2>Status </h2>

        <p v-if="loading">Loading...</p>
        <p v-if="error">{{ error }}</p>
      </div>

      <div class="mx-auto max-w-3xl sm:max-w-5xl lg:max-w-7xl px-16 sm:px-8 lg:px-6">
        <ProductList :products="products" />
      </div>
    </div>
  </div>
</template>