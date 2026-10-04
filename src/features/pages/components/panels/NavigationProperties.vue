<script setup lang="ts">
import type { ElementPatch, NavigationElement, NavigationItem } from '../../types'

const props = defineProps<{
  element: NavigationElement
  /** Absolute indexes (in the editor list) of the cards shown publicly */
  visibleCards: number[]
}>()
const emit = defineEmits<{ update: [patch: ElementPatch] }>()

function updateItem(index: number, patch: Partial<NavigationItem>) {
  const items = props.element.items.map((item, i) => (i === index ? { ...item, ...patch } : item))
  emit('update', { items })
}

function addItem() {
  emit('update', { items: [...props.element.items, { label: 'Nuevo', targetCard: 0 }] })
}

function removeItem(index: number) {
  emit('update', { items: props.element.items.filter((_, i) => i !== index) })
}
</script>

<template>
  <div>
    <span class="panel-label">Botones</span>
    <p class="mb-2 text-xs text-gray-400">Cada botón lleva a una tarjeta visible de la página pública.</p>
    <div class="space-y-2">
      <div v-for="(item, i) in element.items" :key="i" class="flex items-center gap-1 rounded-lg border border-gray-200 p-2">
        <input
          :value="item.label"
          class="w-20 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:border-indigo-400"
          placeholder="Texto"
          aria-label="Texto del botón"
          @input="updateItem(i, { label: ($event.target as HTMLInputElement).value })"
        />
        <span class="text-xs text-gray-400">→</span>
        <select
          :value="item.targetCard"
          class="min-w-0 flex-1 rounded border border-gray-200 bg-white px-1 py-1 text-xs text-gray-900 outline-none focus:border-indigo-400"
          aria-label="Tarjeta destino"
          @change="updateItem(i, { targetCard: Number(($event.target as HTMLSelectElement).value) })"
        >
          <option v-for="(cardIndex, visibleIndex) in visibleCards" :key="cardIndex" :value="visibleIndex">
            Tarjeta {{ cardIndex + 1 }}
          </option>
          <option v-if="item.targetCard >= visibleCards.length" :value="item.targetCard" disabled>
            (no visible)
          </option>
        </select>
        <button
          type="button"
          class="flex h-5 w-5 items-center justify-center rounded text-xs text-gray-400 hover:bg-red-50 hover:text-red-500"
          title="Quitar botón"
          @click="removeItem(i)"
        >×</button>
      </div>
    </div>
    <button
      type="button"
      class="mt-2 w-full rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:border-indigo-400 hover:text-indigo-600"
      @click="addItem"
    >
      + Agregar botón
    </button>
  </div>

  <label class="block">
    <span class="panel-label">Color de botón</span>
    <input
      :value="element.buttonColor"
      type="color"
      class="h-8 w-full cursor-pointer rounded border border-gray-200"
      @input="emit('update', { buttonColor: ($event.target as HTMLInputElement).value })"
    />
  </label>

  <label class="block">
    <span class="panel-label">Color de texto</span>
    <input
      :value="element.buttonTextColor"
      type="color"
      class="h-8 w-full cursor-pointer rounded border border-gray-200"
      @input="emit('update', { buttonTextColor: ($event.target as HTMLInputElement).value })"
    />
  </label>

  <label class="block">
    <span class="panel-label">Bordes redondeados · {{ element.borderRadius }}px</span>
    <input
      :value="element.borderRadius"
      type="range"
      min="0"
      max="24"
      class="w-full accent-indigo-500"
      @input="emit('update', { borderRadius: Number(($event.target as HTMLInputElement).value) })"
    />
  </label>

  <label class="block">
    <span class="panel-label">Separación · {{ element.gap }}px</span>
    <input
      :value="element.gap"
      type="range"
      min="0"
      max="30"
      class="w-full accent-indigo-500"
      @input="emit('update', { gap: Number(($event.target as HTMLInputElement).value) })"
    />
  </label>
</template>
