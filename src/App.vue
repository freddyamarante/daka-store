<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <header class="absolute top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-12 py-10">
      <h1 class="text-xl sm:text-5xl text-teal-700 font-bold">Daka Store</h1>
      <p>
        Freddy Amarante  
      </p>
    </header>
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>