<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from './stores/app'
import ProductList from './components/ProductList.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import FiltersPanel from './components/FiltersPanel.vue'
import PaginationControls from './components/PaginationControls.vue'

const appStore = useAppStore()

const currentPage = ref(1)
const loading = ref(true)
const error = ref('')

const filteredProducts = computed(() => {
  return appStore.filteredProducts({
    categories: appStore.filterOptions.selectedCategories,
    min: appStore.filterOptions.minPrice,
    max: appStore.filterOptions.maxPrice
  })
})

const itemsPerPage = computed(() => appStore.pagination.itemsPerPage)

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  if (filteredProducts.value.length === 0) return []

  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const stats = computed(() => appStore.stats)

const resetToFirstPage = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

onMounted(async () => {
  try {
    await appStore.fetchInitialData()
  } catch (err) {
    error.value = 'Error cargando datos'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="pb-8">
    <div class="mx-auto max-w-3xl sm:max-w-7xl lg:max-w-[1440px] px-6 sm:px-8 lg:px-3 space-y-8 my-10">
      <SettingsPanel />
      <div class="flex flex-col space-y-4">
        <h1 class="text-3xl font-semibold text-teal-700 border-b pb-3 border-teal-800/40">Panel de Productos</h1>
        <p class="text-slate-700 text-sm">
          Total de productos: {{ stats.totalProducts }} | 
          Categorías únicas: {{ stats.uniqueCategories }} | 
          Precio promedio: {{ stats.averagePrice.toFixed(2) }}
        </p>
      </div>
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <aside class="basis-full lg:basis-[28%]">
          <FiltersPanel 
            @price-range-changed="resetToFirstPage" 
            @category-changed="resetToFirstPage" 
          />
        </aside>
        <div class="basis-full lg:basis-[72%]">
          <ProductList :products="paginatedProducts" />
          
          <PaginationControls
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </main>
</template>