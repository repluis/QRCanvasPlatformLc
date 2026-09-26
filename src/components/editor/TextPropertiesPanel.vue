<template>
  <div class="fixed right-0 top-16 bottom-0 w-72 border-l bg-surface overflow-y-auto p-4 shadow-xl z-30">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-text">Propiedades de Texto</h3>
      <button @click="$emit('close')" class="text-text-muted hover:text-text">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-text-muted mb-1">Contenido</label>
        <textarea
          v-model="localContent"
          @input="updateContent"
          class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows="3"
          placeholder="Escribe tu texto..."
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Tamaño</label>
          <input
            type="number"
            v-model.number="localFontSize"
            @change="updateFontSize"
            min="8"
            max="200"
            class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Color</label>
          <input
            type="color"
            v-model="localColor"
            @change="updateColor"
            class="w-full h-10 rounded-lg border border-border bg-bg cursor-pointer"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Peso</label>
          <select
            v-model="localFontWeight"
            @change="updateFontWeight"
            class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="normal">Normal</option>
            <option value="bold">Negrita</option>
            <option value="100">Thin</option>
            <option value="300">Light</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
            <option value="900">Black</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Estilo</label>
          <select
            v-model="localFontStyle"
            @change="updateFontStyle"
            class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="normal">Normal</option>
            <option value="italic">Cursiva</option>
            <option value="oblique">Oblicua</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Alineación</label>
          <select
            v-model="localTextAlign"
            @change="updateTextAlign"
            class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
            <option value="justify">Justificado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Fuente</label>
          <select
            v-model="localFontFamily"
            @change="updateFontFamily"
            class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monoespacio</option>
            <option value="cursive">Cursiva</option>
            <option value="fantasy">Fantasy</option>
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
            <option value="'Merriweather', serif">Merriweather</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <BaseButton
          :variant="localTextDecoration === 'underline' ? 'default' : 'outline'"
          size="sm"
          @click="toggleUnderline"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v-4a2 2 0 012-2h4M4 16l2.5 5L16 9m-9 7v-4a2 2 0 012-2h4M12 4v16" />
          </svg>
        </BaseButton>
        <BaseButton
          :variant="localFontStyle === 'italic' ? 'default' : 'outline'"
          size="sm"
          @click="toggleItalic"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-2.5-10H6M18 19l2.5-10h-2.25a1 1 0 01-1-1V6a1 1 0 011-1h2.5a1 1 0 011 1v2.75" />
          </svg>
        </BaseButton>
        <BaseButton
          :variant="localFontWeight === 'bold' ? 'default' : 'outline'"
          size="sm"
          @click="toggleBold"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 15h16" />
          </svg>
        </BaseButton>
      </div>

      <div v-if="element.type === 'shape'" class="pt-4 border-t border-border">
        <label class="block text-sm font-medium text-text-muted mb-2">Forma</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="shape in shapes"
            :key="shape"
            @click="changeShape(shape)"
            class="p-2 rounded border-2 transition"
            :class="shape === element.shape ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'"
            :title="shape"
          >
            <svg class="h-6 w-6 text-text" fill="currentColor" viewBox="0 0 24 24">
              <path :d="shapePaths[shape]" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import BaseButton from '@components/ui/BaseButton.vue'
import type { PageElement } from '@/types'
import { SHAPES, SHAPE_PATHS } from '@/types/canvas'

interface Props {
  element: PageElement
}

interface Emits {
  update: [id: string, props: Partial<PageElement>]
  close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localContent = ref(props.element.content || '')
const localFontSize = ref(props.element.fontSize || 20)
const localFontWeight = ref(props.element.fontWeight || 'normal')
const localFontStyle = ref(props.element.fontStyle || 'normal')
const localTextDecoration = ref(props.element.textDecoration || 'none')
const localTextAlign = ref(props.element.textAlign || 'center')
const localFontFamily = ref(props.element.fontFamily || 'sans-serif')
const localColor = ref(props.element.color || '#1f2937')

const shapes = SHAPES
const shapePaths = SHAPE_PATHS

function updateContent() {
  emit('update', props.element.id, { content: localContent.value })
}

function updateFontSize() {
  emit('update', props.element.id, { fontSize: localFontSize.value })
}

function updateFontWeight() {
  emit('update', props.element.id, { fontWeight: localFontWeight.value })
}

function updateFontStyle() {
  emit('update', props.element.id, { fontStyle: localFontStyle.value })
}

function updateTextDecoration(value: string) {
  localTextDecoration.value = value
  emit('update', props.element.id, { textDecoration: value })
}

function updateTextAlign() {
  emit('update', props.element.id, { textAlign: localTextAlign.value })
}

function updateFontFamily() {
  emit('update', props.element.id, { fontFamily: localFontFamily.value })
}

function updateColor() {
  emit('update', props.element.id, { color: localColor.value })
}

function toggleUnderline() {
  const newValue = localTextDecoration.value === 'underline' ? 'none' : 'underline'
  updateTextDecoration(newValue)
}

function toggleItalic() {
  const newValue = localFontStyle.value === 'italic' ? 'normal' : 'italic'
  localFontStyle.value = newValue
  emit('update', props.element.id, { fontStyle: newValue })
}

function toggleBold() {
  const newValue = localFontWeight.value === 'bold' ? 'normal' : 'bold'
  localFontWeight.value = newValue
  emit('update', props.element.id, { fontWeight: newValue })
}

function changeShape(shape: string) {
  emit('update', props.element.id, { shape })
}

watch(
  () => props.element.content,
  (val) => {
    localContent.value = val || ''
  }
)

watch(
  () => props.element.fontSize,
  (val) => {
    localFontSize.value = val || 20
  }
)

watch(
  () => props.element.fontWeight,
  (val) => {
    localFontWeight.value = val || 'normal'
  }
)

watch(
  () => props.element.fontStyle,
  (val) => {
    localFontStyle.value = val || 'normal'
  }
)

watch(
  () => props.element.textDecoration,
  (val) => {
    localTextDecoration.value = val || 'none'
  }
)

watch(
  () => props.element.textAlign,
  (val) => {
    localTextAlign.value = val || 'center'
  }
)

watch(
  () => props.element.fontFamily,
  (val) => {
    localFontFamily.value = val || 'sans-serif'
  }
)

watch(
  () => props.element.color,
  (val) => {
    localColor.value = val || '#1f2937'
  }
)
</script>