<script lang="ts" setup>
import type { Product } from './types'
import ProductCard from './ProductCard.vue'

defineProps<{
  products: Product[],
  loading: boolean,
}>()
</script>

<template>
  <div class="w-full h-full">
    <TransitionGroup name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-10">
      <template v-if="!loading">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
          :loaded="true" 
        />
      </template>
      
      <template v-else>
        <ProductCard 
          v-for="n in 4" 
          :key="`skeleton-${n}`" 
          :loaded="false" 
        />
      </template>
    </TransitionGroup>
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

.list-enter-active {
  opacity: 0;
}
</style>