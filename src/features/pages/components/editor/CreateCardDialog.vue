<script setup lang="ts">
import { reactive } from 'vue'
import { DEFAULT_CANVAS_SIZE } from '../../composables/useCanvas'

const emit = defineEmits<{
  confirm: [width: number, height: number, atStart: boolean]
  cancel: []
}>()

const form = reactive({ ...DEFAULT_CANVAS_SIZE, atStart: true })

function clamp(value: number) {
  return Math.min(2000, Math.max(100, Math.round(value || 0)))
}

function submit() {
  emit('confirm', clamp(form.width), clamp(form.height), form.atStart)
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    role="dialog"
    aria-modal="true"
    @click.self="emit('cancel')"
    @keydown.esc="emit('cancel')"
  >
    <form class="w-96 rounded-xl bg-white p-6 shadow-2xl" @submit.prevent="submit">
      <h3 class="mb-4 text-lg font-semibold text-gray-800">Crear nueva tarjeta</h3>

      <div class="space-y-4">
        <label class="block">
          <span class="mb-1 block text-sm text-gray-500">Ancho (px)</span>
          <input v-model.number="form.width" type="number" min="100" max="2000" class="dialog-input" autofocus />
        </label>
        <label class="block">
          <span class="mb-1 block text-sm text-gray-500">Alto (px)</span>
          <input v-model.number="form.height" type="number" min="100" max="2000" class="dialog-input" />
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input v-model="form.atStart" type="checkbox" class="rounded" />
          Colocar en primer lugar
        </label>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button type="button" class="rounded-lg border px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50" @click="emit('cancel')">
          Cancelar
        </button>
        <button type="submit" class="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600">
          Crear
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.dialog-input {
  @apply w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400;
}
</style>
