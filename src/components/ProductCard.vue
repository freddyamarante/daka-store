<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '../stores/app'
  import type Product from '../types'

  const appStore = useAppStore()
  const props = defineProps<{ product: Product }>()

  const formattedUsdPrice = computed(() => {
    return props.product.price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1, 
      maximumFractionDigits: 2
    })
  })
  
  const formattedVesPrice = computed(() => {
    if (appStore.exchangeRate > 0) {
      const priceInVes = props.product.price * appStore.exchangeRate;

      return `Bs. ${priceInVes.toLocaleString('es-VE', {
        style: 'decimal', 
        minimumFractionDigits: 1, 
        maximumFractionDigits: 2
      })}`;
    }
    return 'Bs. --' 
  })

  const currentSelectedFormattedPrice = computed(() => {
    return appStore.displayOptions.selectedCurrency === 'USD' 
      ? formattedUsdPrice.value 
      : formattedVesPrice.value;
  });

  const otherFormattedPrice = computed(() => {
    return appStore.displayOptions.selectedCurrency === 'USD' 
      ? formattedVesPrice.value 
      : formattedUsdPrice.value;
  });
</script>

<template>
  <div
    class="group relative flex flex-col overflow-hidden rounded-xl border border-teal-800/40 bg-white shadow-sm h-full">
    <div class="border-b border-teal-800/40 sm:h-[460px]">
      <img :src="product.image" :alt="`${product.title} - Image`"
        class="w-full aspect-[5/4] object-cover sm:aspect-auto sm:h-full" />
    </div>
    <div class="flex flex-1 flex-col space-y-2 p-4">
      <h2 class="text-md font-medium text-slate-900 line-clamp-1">
        {{ product.title }}
      </h2>
      <p class="text-sm text-slate-500 line-clamp-3">{{ product.description }}</p>
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
  </div>
</template>