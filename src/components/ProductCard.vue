<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '../stores/app'
import { useIntersectionObserver } from '@vueuse/core'
import { RouterLink } from 'vue-router'
import type Product from '../types'

const appStore = useAppStore()
const props = defineProps<{
  product?: Product,
  loaded: boolean
}>()

const imageLoaded = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)

useIntersectionObserver(
  imgRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && imgRef.value && props.loaded && props.product && !imgRef.value.src) {
      imgRef.value.src = props.product.image
      imgRef.value.onload = () => {
        imageLoaded.value = true
      }
    }
  },
  {
    rootMargin: '0px',
    threshold: 0
  }
)

const formattedUsdPrice = computed(() => {
  return props.product?.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }) || ''
})

const formattedVesPrice = computed(() => {
  if (props.product && appStore.exchangeRate > 0) {
    const priceInVes = props.product.price * appStore.exchangeRate
    return `Bs. ${priceInVes.toLocaleString('es-VE', {
      style: 'decimal',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    })}`
  }
  return 'Bs. --'
})

const currentSelectedFormattedPrice = computed(() => {
  return appStore.displayOptions.selectedCurrency === 'USD'
    ? formattedUsdPrice.value
    : formattedVesPrice.value
})

const otherFormattedPrice = computed(() => {
  return appStore.displayOptions.selectedCurrency === 'USD'
    ? formattedVesPrice.value
    : formattedUsdPrice.value
})

const ratingStars = computed(() => {
  return Math.round(props.product?.rating.rate)
})
</script>

<template>
  <RouterLink v-if="loaded && product" :to="{ name: 'product-detail', params: { id: product.id } }"
    class="group relative flex flex-col overflow-hidden rounded-xl border border-teal-800/40 bg-white shadow-sm h-full transition-colors duration-200 ease-in-out">
    <div class="relative border-b border-teal-800/40 h-[420px] sm:h-[460px] overflow-hidden">
      <img ref="imgRef" :data-src="product.image" :alt="`${product.title} - Image`" :class="[
        'w-full object-contain aspect-auto h-full transition duration-200 ease-in-out p-8 rounded-lg',
        imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0 absolute'
      ]" />
      <div v-if="!imageLoaded"
        class="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
          </path>
        </svg>
      </div>
    </div>

    <div class="flex flex-1 flex-col space-y-3 p-7 group-hover:bg-slate-100">
      <h2 class="text-md font-medium text-slate-900 line-clamp-1">
        {{ product.title }}
      </h2>
      <div class="flex items-center gap-1.5">
        <div v-for="star in ratingStars" class="h-4 w-4 text-teal-500" :key="star">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star">
            <path
              d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        </div>
      </div>
      <p class="text-sm text-slate-500 line-clamp-3">
        {{ product.description }}
      </p>
      <div class="flex flex-1 flex-col justify-end">
        <div v-if="appStore.displayOptions.showBothPrices" class="flex items-center space-x-3 leading-none">
          <span class="text-xl font-bold text-teal-700">{{ currentSelectedFormattedPrice }}</span>
          <div class="border border-slate-300 bg-slate-50 py-1 px-1.5 rounded-sm">
            <span class="text-md text-slate-500/90 font-medium">{{ otherFormattedPrice }}</span>
          </div>
        </div>
        <p v-else class="text-xl font-bold text-teal-700 leading-none">{{ currentSelectedFormattedPrice }}</p>
      </div>
    </div>
  </RouterLink>

  <div v-else
    class="group relative flex flex-col overflow-hidden rounded-xl border border-teal-800/40 bg-white shadow-sm h-full transition-colors duration-200 ease-in-out">
    <div class="relative border-b border-teal-800/40 h-[420px] sm:h-[460px] overflow-hidden">
      <div class="relative w-full h-full p-8">
        <div class="relative bg-teal-700/40 rounded-xl h-full w-full z-20 animate-pulse p-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-image-icon lucide-image text-teal-800/30">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col space-y-3 p-7">
      <div class="h-5 w-full bg-teal-700/40 rounded-full animate-pulse"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2 h-2 rounded bg-gray-200"></div>
          <div class="col-span-1 h-2 rounded bg-gray-200"></div>
        </div>
        <div class="h-2 rounded bg-gray-200"></div>
      </div>
      <div class="bg-teal-700 h-6 w-1/6 rounded-full animate-pulse"></div>
    </div>
  </div>
</template>