<script setup lang="ts">
import DraggableElement from './DraggableElement.vue'
import type { Canvas } from '../../types'

defineProps<{
  canvas: Canvas
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string | null]
  move: [id: string, x: number, y: number]
  remove: [id: string]
}>()

function onMove(id: string, x: number, y: number) {
  emit('move', id, x, y)
}
</script>

<template>
  <div class="relative flex-1 overflow-auto bg-gray-100" @pointerdown.self="emit('select', null)">
    <div
      class="relative mx-auto my-8 shadow-lg"
      :style="{ background: canvas.background, width: `${canvas.width}px`, height: `${canvas.height}px` }"
      @pointerdown.self="emit('select', null)"
    >
      <DraggableElement
        v-for="el in canvas.elements"
        :key="el.id"
        :element="el"
        :selected="el.id === selectedId"
        @select="emit('select', $event)"
        @move="onMove"
        @remove="emit('remove', $event)"
      />

      <div
        v-if="canvas.elements.length === 0"
        class="pointer-events-none absolute inset-0 flex items-center justify-center text-gray-400"
      >
        <div class="text-center">
          <svg class="mx-auto mb-2 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p class="text-sm">Agrega texto o imágenes desde la barra de herramientas</p>
        </div>
      </div>
    </div>
  </div>
</template>
