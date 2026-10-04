<script setup lang="ts">
import { computed } from 'vue'
import { FONT_FAMILIES } from '../../constants/library'
import type { ElementPatch, TextElement } from '../../types'

const props = defineProps<{ element: TextElement }>()
const emit = defineEmits<{ update: [patch: ElementPatch] }>()

// Templates may use font stacks outside the list
const isCustomFont = computed(() => !FONT_FAMILIES.some((f) => f.value === props.element.fontFamily))

const ALIGNMENTS = [
  { value: 'left', title: 'Izquierda', path: 'M4 6h16M4 12h10M4 18h14' },
  { value: 'center', title: 'Centro', path: 'M4 6h16M8 12h8M6 18h12' },
  { value: 'right', title: 'Derecha', path: 'M4 6h16M10 12h10M6 18h14' },
] as const

function toggle<K extends 'fontWeight' | 'fontStyle' | 'textDecoration'>(key: K, on: TextElement[K], off: TextElement[K]) {
  emit('update', { [key]: props.element[key] === on ? off : on })
}
</script>

<template>
  <label class="block">
    <span class="panel-label">Contenido</span>
    <textarea
      :value="element.content"
      rows="2"
      class="panel-input"
      @input="emit('update', { content: ($event.target as HTMLTextAreaElement).value })"
    />
  </label>

  <label class="block">
    <span class="panel-label">Fuente</span>
    <select
      :value="element.fontFamily"
      class="panel-input"
      @change="emit('update', { fontFamily: ($event.target as HTMLSelectElement).value })"
    >
      <option v-for="f in FONT_FAMILIES" :key="f.value" :value="f.value">{{ f.label }}</option>
      <option v-if="isCustomFont" :value="element.fontFamily">
        {{ element.fontFamily }}
      </option>
    </select>
  </label>

  <label class="block">
    <span class="panel-label">Tamaño · {{ element.fontSize }}px</span>
    <input
      :value="element.fontSize"
      type="range"
      min="8"
      max="120"
      class="w-full accent-indigo-500"
      @input="emit('update', { fontSize: Number(($event.target as HTMLInputElement).value) })"
    />
  </label>

  <label class="block">
    <span class="panel-label">Color</span>
    <input
      :value="element.color"
      type="color"
      class="h-8 w-full cursor-pointer rounded border border-gray-200"
      @input="emit('update', { color: ($event.target as HTMLInputElement).value })"
    />
  </label>

  <div>
    <span class="panel-label">Estilo</span>
    <div class="flex gap-1.5">
      <button
        type="button"
        class="toggle-btn font-bold"
        :class="{ active: element.fontWeight === 'bold' }"
        title="Negrita"
        @click="toggle('fontWeight', 'bold', 'normal')"
      >B</button>
      <button
        type="button"
        class="toggle-btn italic"
        :class="{ active: element.fontStyle === 'italic' }"
        title="Cursiva"
        @click="toggle('fontStyle', 'italic', 'normal')"
      >I</button>
      <button
        type="button"
        class="toggle-btn underline"
        :class="{ active: element.textDecoration === 'underline' }"
        title="Subrayado"
        @click="toggle('textDecoration', 'underline', 'none')"
      >U</button>
    </div>
  </div>

  <div>
    <span class="panel-label">Alineación</span>
    <div class="flex gap-1.5">
      <button
        v-for="a in ALIGNMENTS"
        :key="a.value"
        type="button"
        class="toggle-btn"
        :class="{ active: element.textAlign === a.value }"
        :title="a.title"
        @click="emit('update', { textAlign: a.value })"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="a.path" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.toggle-btn {
  @apply rounded-lg border px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100;
}
.toggle-btn.active {
  @apply border-indigo-500 bg-indigo-50 text-indigo-700;
}
</style>
