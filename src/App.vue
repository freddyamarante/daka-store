<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useAppStore } from './stores/app'
  import ProductList from './components/ProductList.vue'
  import SettingsPanel from './components/SettingsPanel.vue'

  const appStore = useAppStore()

  const currentPage = ref(1)
  const selectedCategory = ref('all')
  const loading = ref(true)
  const error = ref('')

  onMounted(async () => {
    try {
      await appStore.fetchInitialData()
    } catch (err) {
      error.value = 'Error cargando datos'
    } finally {
      loading.value = false
    }
  })

  const filteredProducts = computed(() => {
    return appStore.filteredProducts({
      category: selectedCategory.value,
      min: appStore.minPrice,
      max: appStore.maxPrice
    })
  })

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * 5
    return filteredProducts.value.slice(start, start + 5)
  })

  const stats = computed(() => ({
    totalProducts: filteredProducts.value.length,
    uniqueCategories: new Set(filteredProducts.value.map(p => p.category)).size,
    averagePrice: filteredProducts.value.reduce((acc, p) => acc + p.price, 0) / filteredProducts.value.length || 0
  }))
</script>

<template>
  <div class="space-y-8">
    <div class="mx-auto max-w-3xl sm:max-w-5xl lg:max-w-[1320px] px-6 sm:px-8 lg:px-3 space-y-8 my-10">
      <SettingsPanel />
      <ProductList :products="paginatedProducts" />
    </div>
  </div>
</template>