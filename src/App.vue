<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useAppStore } from './stores/app'
  import ProductList from './components/ProductList.vue'
  import SettingsPanel from './components/SettingsPanel.vue'
  import FiltersPanel from './components/FiltersPanel.vue'

  const appStore = useAppStore()

  const currentPage = ref(1)
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
      categories: appStore.filterOptions.selectedCategories,
      min: appStore.minPrice,
      max: appStore.maxPrice
    })
  })

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * 6
    return filteredProducts.value.slice(start, start + 6)
  })

  const stats = computed(() => appStore.stats)
</script>

<template>
  <main>
    <div class="mx-auto max-w-3xl sm:max-w-5xl lg:max-w-[1440px] px-6 sm:px-8 lg:px-3 space-y-8 my-10">
      <SettingsPanel />
      <div class="flex flex-col space-y-4">
        <h1 class="text-3xl font-semibold text-teal-700 border-b pb-3 border-teal-800/40">Panel de Productos</h1>
        <p class="text-slate-700 text-sm">
          Total de productos: {{ stats.totalProducts }} | Categorías únicas: {{ stats.uniqueCategories }} | Precio promedio: {{ stats.averagePrice.toFixed(2) }}
        </p>
      </div>
      <div class="flex flex-row">
        <aside class="basis-1/4">
          <FiltersPanel />
        </aside>
        <div class="basis-3/4">
          <ProductList :products="paginatedProducts" />
        </div>
      </div>
    </div>
  </main>
</template>