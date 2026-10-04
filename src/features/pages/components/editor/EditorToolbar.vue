<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@/shared/composables/onClickOutside'
import { SHAPE_PATHS, SHAPES } from '../../constants/shapes'

defineProps<{
  hasSelection: boolean
  /** QR codes link to the saved page, so they need a uuid first */
  canAddQr: boolean
}>()

const emit = defineEmits<{
  addText: []
  uploadImage: []
  addShape: [shape: string]
  addQr: []
  addNavigation: []
  bringForward: []
  sendBackward: []
  remove: []
}>()

const showShapes = ref(false)
const shapesMenu = ref<HTMLElement | null>(null)
onClickOutside(shapesMenu, () => (showShapes.value = false))

function pickShape(shape: string) {
  emit('addShape', shape)
  showShapes.value = false
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 py-3">
    <button type="button" class="tool-btn bg-indigo-500 hover:bg-indigo-600" @click="emit('addText')">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
      Texto
    </button>

    <button type="button" class="tool-btn bg-emerald-500 hover:bg-emerald-600" @click="emit('uploadImage')">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Imagen
    </button>

    <div ref="shapesMenu" class="relative">
      <button type="button" class="tool-btn bg-pink-500 hover:bg-pink-600" @click="showShapes = !showShapes">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path :d="SHAPE_PATHS.star" /></svg>
        Forma
      </button>
      <div
        v-if="showShapes"
        class="absolute left-0 top-full z-50 mt-1 grid w-80 grid-cols-4 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
      >
        <button
          v-for="s in SHAPES"
          :key="s"
          type="button"
          class="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs text-gray-600 transition hover:bg-pink-50 hover:text-pink-600"
          @click="pickShape(s)"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path :d="SHAPE_PATHS[s]" /></svg>
          <span class="capitalize">{{ s }}</span>
        </button>
      </div>
    </div>

    <button
      type="button"
      class="tool-btn bg-violet-500 hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!canAddQr"
      :title="canAddQr ? 'Agregar QR que enlaza a esta página' : 'Guarda la página primero para generar su QR'"
      @click="emit('addQr')"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
      QR
    </button>

    <button type="button" class="tool-btn bg-amber-600 hover:bg-amber-700" @click="emit('addNavigation')">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
      Nav
    </button>

    <template v-if="hasSelection">
      <div class="mx-1 h-6 w-px bg-gray-300" />
      <button type="button" class="tool-btn bg-amber-500 px-3 hover:bg-amber-600" title="Traer adelante" @click="emit('bringForward')">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button type="button" class="tool-btn bg-amber-500 px-3 hover:bg-amber-600" title="Enviar atrás" @click="emit('sendBackward')">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <button type="button" class="tool-btn bg-red-500 hover:bg-red-600" title="Eliminar (Supr)" @click="emit('remove')">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Eliminar
      </button>
    </template>
  </div>
</template>

<style scoped>
.tool-btn {
  @apply flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition active:scale-95;
}
</style>
