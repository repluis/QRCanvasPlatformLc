<script setup lang="ts">
import type { ElementPatch, QrElement } from '../../types'

defineProps<{ element: QrElement }>()
const emit = defineEmits<{ update: [patch: ElementPatch] }>()

const LEVELS = [
  { value: 'low', label: 'Baja (7%)' },
  { value: 'medium', label: 'Media (15%)' },
  { value: 'quartile', label: 'Alta (25%)' },
  { value: 'high', label: 'Máxima (30%)' },
] as const
</script>

<template>
  <div>
    <span class="panel-label">Enlace</span>
    <a :href="element.content" target="_blank" rel="noopener" class="block break-all text-xs text-indigo-600 hover:underline">
      {{ element.content }}
    </a>
  </div>

  <label class="block">
    <span class="panel-label">Color del QR</span>
    <input
      :value="element.foregroundColor"
      type="color"
      class="h-8 w-full cursor-pointer rounded border border-gray-200"
      @input="emit('update', { foregroundColor: ($event.target as HTMLInputElement).value })"
    />
  </label>

  <label class="block">
    <span class="panel-label">Color de fondo</span>
    <input
      :value="element.backgroundColor"
      type="color"
      class="h-8 w-full cursor-pointer rounded border border-gray-200"
      @input="emit('update', { backgroundColor: ($event.target as HTMLInputElement).value })"
    />
  </label>

  <label class="block">
    <span class="panel-label">Corrección de errores</span>
    <select
      :value="element.errorCorrectionLevel"
      class="panel-input"
      @change="emit('update', { errorCorrectionLevel: ($event.target as HTMLSelectElement).value as QrElement['errorCorrectionLevel'] })"
    >
      <option v-for="l in LEVELS" :key="l.value" :value="l.value">{{ l.label }}</option>
    </select>
  </label>
</template>
