<template>
  <div class="fixed right-0 top-16 bottom-0 w-72 border-l bg-surface overflow-y-auto p-4 shadow-xl z-30">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-text">Propiedades de Navegación</h3>
      <button @click="$emit('close')" class="text-text-muted hover:text-text">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-text-muted mb-1">Color de botones</label>
        <input
          type="color"
          v-model="localButtonColor"
          @change="updateButtonColor"
          class="w-full h-10 rounded-lg border border-border bg-bg cursor-pointer"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-muted mb-1">Color de texto</label>
        <input
          type="color"
          v-model="localButtonTextColor"
          @change="updateButtonTextColor"
          class="w-full h-10 rounded-lg border border-border bg-bg cursor-pointer"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-muted mb-1">Radio de borde</label>
        <input
          type="number"
          v-model.number="localBorderRadius"
          @change="updateBorderRadius"
          min="0"
          max="50"
          class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-muted mb-1">Espacio entre botones</label>
        <input
          type="number"
          v-model.number="localGap"
          @change="updateGap"
          min="0"
          max="50"
          class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div class="pt-4 border-t border-border">
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-text-muted">Botones ({{ totalCards }} tarjetas disponibles)</label>
          <BaseButton size="sm" variant="secondary" @click="addButton">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Añadir
          </BaseButton>
        </div>

        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="(item, index) in localItems"
            :key="index"
            class="flex items-center gap-2 p-2 bg-bg rounded-lg border border-border"
          >
            <input
              type="text"
              v-model="item.label"
              @input="updateItems"
              placeholder="Etiqueta"
              class="flex-1 rounded-lg border border-border bg-bg p-1.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              v-model.number="item.targetCard"
              @change="updateItems"
              class="rounded-lg border border-border bg-bg p-1.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option v-for="i in totalCards" :key="i" :value="i">Tarjeta {{ i }}</option>
            </select>
            <BaseButton
              variant="ghost"
              size="icon"
              class="text-danger"
              @click="removeButton(index)"
              title="Eliminar botón"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '@components/ui/BaseButton.vue'
import type { PageElement, NavigationItem } from '@/types'

interface Props {
  element: PageElement
  totalCards: number
}

interface Emits {
  update: [id: string, props: Partial<PageElement>]
  close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localItems = ref<NavigationItem[]>(props.element.items || [
  { label: 'Menú', targetCard: 1 },
  { label: 'Bebidas', targetCard: 2 },
  { label: 'Contacto', targetCard: 3 },
])
const localButtonColor = ref(props.element.buttonColor || '#d97706')
const localButtonTextColor = ref(props.element.buttonTextColor || '#ffffff')
const localBorderRadius = ref(props.element.borderRadius || 8)
const localGap = ref(props.element.gap || 10)

function updateItems() {
  emit('update', props.element.id, { items: localItems.value })
}

function addButton() {
  localItems.value.push({ label: `Botón ${localItems.value.length + 1}`, targetCard: 1 })
  updateItems()
}

function removeButton(index: number) {
  localItems.value.splice(index, 1)
  updateItems()
}

function updateButtonColor() {
  emit('update', props.element.id, { buttonColor: localButtonColor.value })
}

function updateButtonTextColor() {
  emit('update', props.element.id, { buttonTextColor: localButtonTextColor.value })
}

function updateBorderRadius() {
  emit('update', props.element.id, { borderRadius: localBorderRadius.value })
}

function updateGap() {
  emit('update', props.element.id, { gap: localGap.value })
}

watch(
  () => props.element.items,
  (val) => {
    if (val) localItems.value = [...val]
  },
  { deep: true }
)

watch(
  () => props.element.buttonColor,
  (val) => {
    localButtonColor.value = val || '#d97706'
  }
)

watch(
  () => props.element.buttonTextColor,
  (val) => {
    localButtonTextColor.value = val || '#ffffff'
  }
)

watch(
  () => props.element.borderRadius,
  (val) => {
    localBorderRadius.value = val || 8
  }
)

watch(
  () => props.element.gap,
  (val) => {
    localGap.value = val || 10
  }
)
</script>