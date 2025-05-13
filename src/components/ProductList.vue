<script lang="ts" setup>
import type { Product } from './types'
import ProductCard from './ProductCard.vue'

defineProps<{
  products: Product[],
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-10">
     <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>