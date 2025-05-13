<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../stores/app';

const appStore = useAppStore();

const selectedCategories = computed({
  get() {
    return appStore.filterOptions.selectedCategories;
  },
  set(value) {
    appStore.filterOptions.selectedCategories = value;
  }
})

const handleCheckboxChange = (category: string) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== category);
  } else {
    selectedCategories.value.push(category);
  }
};
</script>

<template>
  <div class="flex flex-col space-y-4">
    <h2 class="text-lg font-medium">
      Categorías
    </h2>
    <div v-for="category in appStore.categories" class="flex items-center" :key="category">
      <input type="checkbox" :id="category" :value="category" :checked="selectedCategories.includes(category)"
        @change="handleCheckboxChange(category)"
        class="h-3 w-3 border-slate-200 rounded focus:ring-teal-500 focus:ring-offset-0 cursor-pointer" />
      <label :for="category"
        class="ml-3 block text-sm font-medium text-slate-700 cursor-pointer capitalize leading-none">{{ category
        }}</label>
    </div>
  </div>
</template>