<script setup lang="ts">
import { computed } from 'vue'
import type Product from '../types'

const props = defineProps<{
  product: Product,
  currency: string,
  exchangeRate: number
}>()

const formattedPrice = computed(() => {
  const productPrice = props.product.price
  const exchangeRate = props.exchangeRate
  
  if (props.currency === 'USD') {
    return `$${productPrice.toFixed(2)} USD` 
  } else if (props.currency === 'Bs') {
    const priceInBs = productPrice * exchangeRate
    
    return `Bs. ${priceInBs.toLocaleString('es-VE', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }
  
  return '' 
})

</script>

<template>
  <div class="group relative flex flex-col overflow-hidden rounded-xl border border-teal-800/40 bg-white shadow-sm h-full">
    <div class="border-b border-teal-800/40 sm:h-[460px]">
      <img
      :src="product.image"
      :alt="`${product.title} - Image`"
      class="w-full aspect-[5/4] object-cover sm:aspect-auto sm:h-full"
      />
    </div>
    <div class="flex flex-1 flex-col space-y-2 p-4">
      <h2 class="text-md font-medium text-slate-900 line-clamp-1">
          {{ product.title }}
      </h2>
      <p class="text-sm text-slate-500 line-clamp-3">{{ product.description }}</p>
      <div class="flex flex-1 flex-col justify-end">
        <p class="text-sm italic text-slate-500">{{ product.options }}</p>
        <p class="text-lg font-semibold text-slate-900">{{ formattedPrice }}</p>
      </div>
    </div>
  </div>
</template>