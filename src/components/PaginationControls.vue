<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])

const visiblePageNumbers = computed(() => {
  const pages = []
  if (props.totalPages <= props.maxVisiblePages) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    const startPage = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2))
    const endPage = Math.min(props.totalPages, startPage + props.maxVisiblePages - 1)
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  return pages
})

const shouldShowEllipsisEnd = computed(() => {
  return props.totalPages > props.maxVisiblePages && 
         visiblePageNumbers.value[visiblePageNumbers.value.length - 1] < props.totalPages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const nextPage = () => {
  goToPage(props.currentPage + 1)
}

const prevPage = () => {
  goToPage(props.currentPage - 1)
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2">
    <button 
      @click="prevPage" 
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded-md bg-white text-slate-700 border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Anterior
    </button>
    <div class="flex items-center space-x-1">
      <button 
        v-for="page in visiblePageNumbers" 
        :key="page" 
        @click="goToPage(page)" 
        :class="[
          'px-2.5 py-1 rounded-md border border-slate-300',
          currentPage === page ? 'bg-teal-500 text-white font-semibold' : 'bg-white text-slate-700 hover:bg-slate-200',
        ]"
      >
        {{ page }}
      </button>
      <span v-if="shouldShowEllipsisEnd" class="text-slate-500 mx-2">...</span>
    </div>
    <button 
      @click="nextPage" 
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded-md bg-white text-slate-700 border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Siguiente
    </button>
  </div>
</template>