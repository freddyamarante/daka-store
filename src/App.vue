<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

interface Product {
  id: number
  title: string
  price: number
  category: string
  image: string
}

const products = ref<Product[]>([])
const categories = ref<string[]>([])
const exchangeRate = ref(0)
const exchangeDatetime = ref<{date: string, time: string}>({
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
  }
})

</script>

<template>
  <div class="space-y-8">
    <div>
      <h2>Debug Info</h2>


      <!-- <pre>{{ { products, categories, exchangeRate, exchangeDatetime, currentPage, selectedCategory, minPrice, maxPrice, loading, error } }}</pre> -->
    </div>
  </div>
</template>