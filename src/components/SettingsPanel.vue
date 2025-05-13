<script setup lang="ts">
import { useAppStore } from '../stores/app';

const appStore = useAppStore();
</script>

<template>
  <div class="flex flex-col space-y-6 rounded-xl bg-slate-100 p-6 border border-teal-800/40 shadow-lg">
    <h1 class="text-3xl font-semibold text-teal-700 border-b pb-3 border-teal-800/40">Panel de Configuración</h1>

    <div class="space-y-3">
      <h2 class="text-xl font-medium text-slate-800">Visualización de Precios</h2>
      
      <div class="p-4 bg-white rounded-lg shadow border border-slate-200 space-y-4">
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="showBothPrices" 
            v-model="appStore.displayOptions.showBothPrices"
            class="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-offset-0 cursor-pointer"
          />
          <label for="showBothPrices" class="ml-3 block text-sm font-medium text-slate-700 cursor-pointer">Mostrar precios en ambas monedas (USD y Bs.)</label>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Moneda principal activa:</label>
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
            <div class="flex items-center">
              <input 
                type="radio" 
                id="currencyUSD" 
                name="selectedCurrency" 
                value="USD" 
                v-model="appStore.displayOptions.selectedCurrency"
                class="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500 cursor-pointer"
              />
              <label for="currencyUSD" class="ml-2 text-sm text-slate-700 cursor-pointer">Dólares (USD)</label>
            </div>
            <div class="flex items-center">
              <input 
                type="radio" 
                id="currencyBs" 
                name="selectedCurrency" 
                value="Bs" 
                v-model="appStore.displayOptions.selectedCurrency"
                class="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500 cursor-pointer"
              />
              <label for="currencyBs" class="ml-2 text-sm text-slate-700 cursor-pointer">Bolívares (Bs.)</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <h2 class="text-xl font-medium text-slate-800">Información de Tasa de Cambio</h2>
      <div class="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
        <div v-if="appStore.exchangeRate > 0">
          <p class="text-slate-700 text-sm">
            Tasa BCV actual: 
            <span class="font-semibold text-md text-teal-600">
              1 USD = {{ appStore.exchangeRate.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }} Bs.
            </span>
          </p>
          <p v-if="appStore.exchangeDatetime.date && appStore.exchangeDatetime.time" class="text-xs text-slate-500 mt-1">
            Obtenido el: {{ appStore.exchangeDatetime.date }} a las {{ appStore.exchangeDatetime.time }}
          </p>
        </div>
        <p v-else class="text-slate-600 text-sm italic">
          Tasa de cambio no disponible o cargando...
        </p>
      </div>
    </div>

    </div>
</template>