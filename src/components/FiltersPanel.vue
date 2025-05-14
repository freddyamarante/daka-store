<script setup lang="ts">
import { computed, defineEmits } from 'vue';
import { useAppStore } from '../stores/app';
import RangeSlider from './RangeSlider.vue';

const appStore = useAppStore();

const emit = defineEmits(['categoryChanged', 'priceRangeChanged']);

const selectedCategories = computed({
  get() {
    return appStore.filterOptions.selectedCategories;
  },
  set(value) {
    appStore.filterOptions.selectedCategories = value;
  },
});

const handleCheckboxChange = (category: string) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== category);
  } else {
    selectedCategories.value.push(category);
  }

  emit('categoryChanged')
};

const availableMin = computed(() =>
  appStore.products.length ? Math.min(...appStore.products.map(p => p.price)) : 0
);

const availableMax = computed(() =>
  appStore.products.length ? Math.max(...appStore.products.map(p => p.price)) : 1000
);

const priceRange = computed({
  get() {
    return {
      min: appStore.filterOptions.minPrice,
      max: appStore.filterOptions.maxPrice,
    };
  },
  set(value) {
    appStore.filterOptions.minPrice = value.min;
    appStore.filterOptions.maxPrice = value.max;
  },
});
</script>

<template>
  <div class="flex flex-col">
    <div>
      <h3 class="text-lg font-medium mb-2">Categorías</h3>
      <div v-for="category in appStore.categories" :key="category" class="flex items-center mb-2">
        <input
          type="checkbox"
          :id="category"
          :value="category"
          :checked="selectedCategories.includes(category)"
          @change="handleCheckboxChange(category)"
          class="h-4 w-4 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
        />
        <label :for="category" class="ml-3 text-gray-700 capitalize cursor-pointer">{{ category }}</label>
      </div>
    </div>

    <hr class="h-px w-full border-teal-800/40 my-4" />

    <div>
      <h3 class="text-lg font-medium mb-2">Rango de Precios</h3>
      <RangeSlider
        v-model="priceRange"
        @update:modelValue="(value) => $emit('priceRangeChanged', value)"
        :min="availableMin"
        :max="availableMax"
      />
      <div class="flex justify-between text-sm text-gray-600 mt-2">
        <span>${{ priceRange.min.toFixed(2) }}</span>
        <span>${{ priceRange.max.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>