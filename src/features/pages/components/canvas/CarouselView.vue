<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CarouselElement } from '../../types'

const props = defineProps<{ element: CarouselElement }>()

const index = ref(0)
const total = computed(() => props.element.images.length)
const current = computed(() => (total.value ? props.element.images[index.value % total.value] : null))

function step(delta: number) {
  if (!total.value) return
  index.value = (index.value + delta + total.value) % total.value
}
</script>

<template>
  <div class="relative h-full w-full overflow-hidden rounded bg-gray-100">
    <img v-if="current" :src="current.url" class="pointer-events-none h-full w-full object-cover" draggable="false" alt="" />
    <div v-else class="flex h-full w-full items-center justify-center text-xs text-gray-400">Sin imágenes</div>

    <template v-if="total > 1">
      <button
        type="button"
        class="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white shadow transition hover:bg-black/70"
        title="Anterior"
        @mousedown.stop
        @click.stop="step(-1)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        class="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white shadow transition hover:bg-black/70"
        title="Siguiente"
        @mousedown.stop
        @click.stop="step(1)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div class="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
        {{ index + 1 }} / {{ total }}
      </div>
    </template>
  </div>
</template>
