<script setup lang="ts">
import TextProperties from './TextProperties.vue'
import QrProperties from './QrProperties.vue'
import NavigationProperties from './NavigationProperties.vue'
import type { CanvasElement, ElementPatch, ShapeElement } from '../../types'

defineProps<{
  element: CanvasElement
  visibleCards: number[]
}>()

const emit = defineEmits<{
  update: [patch: ElementPatch]
  close: []
}>()

const TITLES: Record<CanvasElement['type'], string> = {
  text: 'Texto',
  image: 'Imagen',
  shape: 'Forma',
  qr: 'Código QR',
  animation: 'Animación',
  carousel: 'Carrusel',
  navigation: 'Navegación',
}

function numberFrom(e: Event) {
  return Math.max(10, Math.round(Number((e.target as HTMLInputElement).value) || 0))
}
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col overflow-y-auto border-l bg-white p-4">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500">{{ TITLES[element.type] }}</h3>
      <button
        type="button"
        class="rounded px-2 py-0.5 text-xs text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        title="Volver a la biblioteca"
        @click="emit('close')"
      >
        Cerrar
      </button>
    </div>

    <div class="space-y-3">
      <TextProperties v-if="element.type === 'text'" :element="element" @update="emit('update', $event)" />

      <QrProperties v-else-if="element.type === 'qr'" :element="element" @update="emit('update', $event)" />

      <NavigationProperties
        v-else-if="element.type === 'navigation'"
        :element="element"
        :visible-cards="visibleCards"
        @update="emit('update', $event)"
      />

      <template v-else-if="element.type === 'shape' || element.type === 'animation'">
        <p v-if="element.type === 'shape'" class="text-sm font-medium capitalize text-gray-900">
          {{ (element as ShapeElement).shape }}
        </p>
        <label class="block">
          <span class="panel-label">Color</span>
          <input
            :value="element.color"
            type="color"
            class="h-8 w-full cursor-pointer rounded border border-gray-200"
            @input="emit('update', { color: ($event.target as HTMLInputElement).value })"
          />
        </label>
      </template>

      <div class="border-t pt-3">
        <span class="panel-label">Tamaño (px)</span>
        <div class="grid grid-cols-2 gap-2">
          <label class="text-xs text-gray-400">
            Ancho
            <input :value="element.width" type="number" min="10" class="panel-input" @change="emit('update', { width: numberFrom($event) })" />
          </label>
          <label class="text-xs text-gray-400">
            Alto
            <input :value="element.height" type="number" min="10" class="panel-input" @change="emit('update', { height: numberFrom($event) })" />
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>
