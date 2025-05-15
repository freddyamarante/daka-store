<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores/app'
import type { Product } from '../types'

const appStore = useAppStore()
const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const existingProduct = appStore.products.find(p => p.id === Number(route.params.id))
    if (existingProduct) {
      product.value = existingProduct
    } else {
      const response = await fetch(`https://fakestoreapi.com/products/${route.params.id}`)
      product.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
})

const formattedUsdPrice = computed(() => {
  return product.value?.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1, 
    maximumFractionDigits: 2
  }) || ''
})

const formattedVesPrice = computed(() => {
  if (product.value && appStore.exchangeRate > 0) {
    const priceInVes = product.value.price * appStore.exchangeRate
    return `Bs. ${priceInVes.toLocaleString('es-VE', {
      style: 'decimal', 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 2
    })}`
  }
  return 'Bs. --' 
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <RouterLink 
      to="/" 
      class="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors mb-6"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to products
    </RouterLink>

    <Transition name="fade" mode="out-in">
      <div v-if="loading" key="loading" class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="bg-slate-200 rounded-xl h-[500px] animate-pulse"></div>
        <div class="space-y-6">
          <div class="h-10 bg-slate-200 rounded w-3/4 animate-pulse"></div>
          <div class="h-6 bg-slate-200 rounded w-1/2 animate-pulse"></div>
          <div class="space-y-3">
            <div class="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div class="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div v-else-if="product" key="product" class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Transition name="slide" appear>
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <img 
              :src="product.image" 
              :alt="product.title"
              class="w-full h-auto max-h-[500px] object-contain p-8"
            >
          </div>
        </Transition>

        <div class="space-y-6">
          <Transition name="slide" appear>
            <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>
          </Transition>

          <Transition name="slide" appear>
            <div class="flex items-center space-x-4">
              <span class="text-3xl font-bold text-teal-600">
                {{ formattedUsdPrice }}
              </span>
              <div v-if="appStore.displayOptions.showBothPrices" class="border border-slate-300 bg-slate-50 py-1 px-1.5 rounded-sm">
                <span class="text-lg text-slate-500/90 font-medium">{{ formattedVesPrice }}</span>
              </div>
            </div>
          </Transition>

          <Transition name="slide" appear>
            <div class="flex items-center">
              <span class="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded capitalize">
                {{ product.category }}
              </span>
            </div>
          </Transition>

          <Transition name="slide" appear>
            <p class="text-slate-700">{{ product.description }}</p>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.3s ease-in;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide:nth-child(1) { transition-delay: 0.1s }
.slide:nth-child(2) { transition-delay: 0.2s }
.slide:nth-child(3) { transition-delay: 0.3s }
.slide:nth-child(4) { transition-delay: 0.4s }
</style>