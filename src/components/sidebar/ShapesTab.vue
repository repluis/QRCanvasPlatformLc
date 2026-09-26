<template>
  <div class="flex flex-col h-full">
    <h4 class="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Formas</h4>
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="shape in shapes"
          :key="shape"
          @click="addShape(shape)"
          class="aspect-square rounded-lg border-2 border-border flex items-center justify-center hover:border-primary hover:bg-surface-alt transition"
          :title="shape"
        >
          <svg class="h-8 w-8 text-text" fill="currentColor" viewBox="0 0 24 24">
            <path :d="shapePaths[shape]" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SHAPES, SHAPE_PATHS } from '@/types/canvas'

interface Emits {
  'add-shape': [shape: string]
}

const emit = defineEmits<Emits>()

const shapes = SHAPES
const shapePaths = SHAPE_PATHS

function addShape(shape: string) {
  emit('add-shape', shape)
}
</script>