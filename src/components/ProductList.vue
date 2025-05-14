<script lang="ts" setup>
import type { Product } from './types'
import ProductCard from './ProductCard.vue'

defineProps<{
  products: Product[],
}>()
</script>

<template>
  <div class="w-full h-full">
    <div v-if="products.length > 0">
      <TransitionGroup name="list" tag="div" class="flex flex-wrap gap-4">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </TransitionGroup>
    </div>

    <div v-else>
      <div class="flex flex-col items-center justify-center h-full py-24">
        <h2 class="text-xl font-semibold text-slate-700">No hay productos disponibles</h2>
        <p class="text-sm text-slate-500">Intenta ajustar los filtros o recargar la página.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-active {
  position: relative;
}
</style>