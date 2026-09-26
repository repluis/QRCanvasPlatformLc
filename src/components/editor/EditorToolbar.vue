<template>
  <div class="flex flex-1 items-center justify-center gap-2">
    <div class="flex items-center gap-1 border-r border-border pr-4">
      <BaseButton
        variant="outline"
        size="icon"
        @click="$emit('add-text')"
        title="Añadir texto"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 000 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 01-2-2V7a2 2 0 012-2h3a1 1 0 001-1V4z" />
        </svg>
      </BaseButton>

      <BaseButton
        variant="outline"
        size="icon"
        @click="$emit('add-image')"
        title="Añadir imagen"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </BaseButton>

      <div class="relative" @click="$emit('add-shape', 'heart')">
        <BaseButton variant="outline" size="icon" title="Añadir forma">
          <svg class="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </BaseButton>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-wrap gap-1 p-2 bg-surface border border-border rounded-lg shadow-lg z-10">
          <button
            v-for="shape in shapes"
            :key="shape"
            @click.stop="$emit('add-shape', shape)"
            class="p-1 rounded hover:bg-surface-alt transition"
            :title="shape"
          >
            <svg class="h-5 w-5 text-text" fill="currentColor" viewBox="0 0 24 24">
              <path :d="shapePaths[shape]" />
            </svg>
          </button>
        </div>
      </div>

      <BaseButton
        variant="outline"
        size="icon"
        @click="$emit('add-qr')"
        title="Añadir QR"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      </BaseButton>

      <BaseButton
        variant="outline"
        size="icon"
        @click="$emit('add-navigation')"
        title="Añadir navegación"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </BaseButton>
    </div>

    <div v-if="hasSelection" class="flex items-center gap-1 border-r border-border px-4">
      <BaseButton
        v-if="selectedType === 'text' || selectedType === 'shape'"
        variant="outline"
        size="icon"
        @click="$emit('bring-forward')"
        title="Traer al frente"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </BaseButton>

      <BaseButton
        v-if="selectedType === 'text' || selectedType === 'shape'"
        variant="outline"
        size="icon"
        @click="$emit('send-backward')"
        title="Enviar al fondo"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </BaseButton>

      <BaseButton
        variant="destructive"
        size="icon"
        @click="$emit('remove')"
        title="Eliminar"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@components/ui/BaseButton.vue'
import { SHAPES, SHAPE_PATHS } from '@/types/canvas'

interface Props {
  hasSelection: boolean
  selectedType: string | null
  shapes: readonly string[]
}

interface Emits {
  'add-text': []
  'add-image': []
  'add-shape': [shape: string]
  'add-qr': []
  'add-navigation': []
  remove: []
  'bring-forward': []
  'send-backward': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const shapePaths = computed(() => SHAPE_PATHS)
</script>