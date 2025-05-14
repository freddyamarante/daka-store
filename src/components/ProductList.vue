<script lang="ts" setup>
import type { Product } from './types'
import ProductCard from './ProductCard.vue'

defineProps<{
  products: Product[],
}>()
</script>

<template>
  <div class="w-full h-full">
    <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-10">
       <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <div v-else>
      <div class="flex flex-col items-center justify-center h-full py-24">
        <h2 class="text-xl font-semibold text-slate-700">No hay productos disponibles</h2>
        <p class="text-sm text-slate-500">Intenta ajustar los filtros o recargar la página.</p>
      </div>
    </div>
  </div>
</template>