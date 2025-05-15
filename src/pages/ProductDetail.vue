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

const ratingStars = computed(() => {
  return Math.round(product.value?.rating.rate)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32">
    <RouterLink to="/" class="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clip-rule="evenodd" />
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
            <img :src="product.image" :alt="product.title" class="w-full h-auto max-h-[500px] object-contain p-8">
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
              <div v-if="appStore.displayOptions.showBothPrices"
                class="border border-slate-300 bg-slate-50 py-1 px-1.5 rounded-sm">
                <span class="text-lg text-slate-500/90 font-medium">{{ formattedVesPrice }}</span>
              </div>
            </div>
          </Transition>

          <Transition name="slide" appear>
            <div class="flex items-center gap-1.5">
              <div v-for="star in ratingStars" class="h-4 w-4 text-teal-500" :key="star">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="lucide lucide-star-icon lucide-star">
                  <path
                    d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
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

.slide:nth-child(1) {
  transition-delay: 0.1s
}

.slide:nth-child(2) {
  transition-delay: 0.2s
}

.slide:nth-child(3) {
  transition-delay: 0.3s
}

.slide:nth-child(4) {
  transition-delay: 0.4s
}
</style>