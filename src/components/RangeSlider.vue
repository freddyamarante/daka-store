<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const internalMinValue = ref(props.modelValue.min);
const internalMaxValue = ref(props.modelValue.max);

watch(
  () => props.modelValue,
  (newValue) => {
    internalMinValue.value = newValue.min;
    internalMaxValue.value = newValue.max;
  },
  { deep: true }
);

watch(internalMinValue, (newValue) => {
  if (newValue > internalMaxValue.value) {
    internalMaxValue.value = newValue;
  }
  emit('update:modelValue', { min: newValue, max: internalMaxValue.value });
});

watch(internalMaxValue, (newValue) => {
  if (newValue < internalMinValue.value) {
    internalMinValue.value = newValue;
  }
  emit('update:modelValue', { min: internalMinValue.value, max: newValue });
});

const trackStyle = computed(() => {
  const minValue = internalMinValue.value;
  const maxValue = internalMaxValue.value;
  const range = props.max - props.min;
  const left = range === 0 ? 0 : ((minValue - props.min) / range) * 100;
  const right = range === 0 ? 0 : 100 - ((maxValue - props.min) / range) * 100;
  return {
    left: `${left}%`,
    right: `${right}%`,
  };
});

const sliderTrack = ref<HTMLElement | null>(null);
const minThumb = ref<HTMLElement | null>(null);
const maxThumb = ref<HTMLElement | null>(null);

const isMinDragging = ref(false);
const isMaxDragging = ref(false);

const startX = ref(0);
const currentX = ref(0);

const handleStart = (event: MouseEvent | TouchEvent, isMin: boolean) => {
  isMin ? (isMinDragging.value = true) : (isMaxDragging.value = true);
  startX.value = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  if (sliderTrack.value) {
    currentX.value =
      (isMin
        ? (internalMinValue.value - props.min) / (props.max - props.min)
        : (internalMaxValue.value - props.min) / (props.max - props.min)) *
      sliderTrack.value.offsetWidth;
  }
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);
  document.addEventListener('touchcancel', handleEnd);
};

const handleMove = (event: MouseEvent | TouchEvent) => {
  if (!isMinDragging.value && !isMaxDragging.value) return;

  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const diffX = clientX - startX.value;
  if (sliderTrack.value) {
    const trackWidth = sliderTrack.value.offsetWidth;
    let newRatio = (currentX.value + diffX) / trackWidth;
    newRatio = Math.max(0, Math.min(1, newRatio));
    const newValue = props.min + newRatio * (props.max - props.min);

    if (isMinDragging.value) {
      internalMinValue.value = newValue;
    } else if (isMaxDragging.value) {
      internalMaxValue.value = newValue;
    }
  }
};

const handleEnd = () => {
  isMinDragging.value = false;
  isMaxDragging.value = false;
  document.removeEventListener('mousemove', handleMove);
  document.removeEventListener('mouseup', handleEnd);
  document.removeEventListener('touchmove', handleMove);
  document.removeEventListener('touchend', handleEnd);
  document.removeEventListener('touchcancel', handleEnd);
};

const handleMinMouseDown = (event: MouseEvent) => handleStart(event, true);
const handleMaxMouseDown = (event: MouseEvent) => handleStart(event, false);
const handleMinTouchStart = (event: TouchEvent) => handleStart(event, true);
const handleMaxTouchStart = (event: TouchEvent) => handleStart(event, false);

onMounted(() => {
  if (minThumb.value) {
    minThumb.value.addEventListener('mousedown', handleMinMouseDown);
    minThumb.value.addEventListener('touchstart', handleMinTouchStart, { passive: false });
  }
  if (maxThumb.value) {
    maxThumb.value.addEventListener('mousedown', handleMaxMouseDown);
    maxThumb.value.addEventListener('touchstart', handleMaxTouchStart, { passive: false });
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMove);
  document.removeEventListener('mouseup', handleEnd);
  document.removeEventListener('touchmove', handleMove);
  document.removeEventListener('touchend', handleEnd);
  document.removeEventListener('touchcancel', handleEnd);
  if (minThumb.value) {
    minThumb.value.removeEventListener('mousedown', handleMinMouseDown);
    minThumb.value.removeEventListener('touchstart', handleMinTouchStart);
  }
  if (maxThumb.value) {
    maxThumb.value.removeEventListener('mousedown', handleMaxMouseDown);
    maxThumb.value.removeEventListener('touchstart', handleMaxTouchStart);
  }
});
</script>

<template>
  <div class="relative h-6 w-full" ref="sliderTrack">
    <div class="absolute top-1/2 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2"></div>

    <div class="absolute top-1/2 h-1 bg-teal-500 rounded-full transform -translate-y-1/2" :style="trackStyle"></div>

    <input type="range"
      class="pointer-events-none appearance-none absolute top-0 w-full h-full bg-transparent focus:outline-none"
      :min="min" :max="max" :step="1" :value="internalMinValue" style="padding: 0;" />
    <div ref="minThumb"
      class="absolute top-1/2 w-5 h-5 bg-white border-2 border-teal-700 rounded-full shadow transform -translate-y-1/2 -translate-x-1 cursor-grab touch-none"
      :style="{ left: `${((internalMinValue - min) / (max - min)) * 100}%` }"></div>

    <input type="range"
      class="pointer-events-none appearance-none absolute top-0 w-full h-full bg-transparent focus:outline-none"
      :min="min" :max="max" :step="1" :value="internalMaxValue" style="padding: 0;" />
    <div ref="maxThumb"
      class="absolute top-1/2 w-5 h-5 bg-white border-2 border-teal-700 rounded-full shadow transform -translate-y-1/2 -translate-x-1/2 cursor-grab touch-none"
      :style="{ left: `${((internalMaxValue - min) / (max - min)) * 100}%` }"></div>
  </div>
</template>

<style scoped>
input[type='range'] {
  margin: 0;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: all;
  width: 0px;
  height: 0px;
}

input[type='range']::-moz-range-thumb {
  -moz-appearance: none;
  appearance: none;
  pointer-events: all;
  width: 0px;
  height: 0px;
}
</style>