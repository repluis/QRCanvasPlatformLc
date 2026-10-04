<script setup lang="ts">
import { isDarkColor } from '@/shared/utils/color'
import type { Canvas } from '../../types'

defineProps<{
  canvases: Canvas[]
  activeIndex: number
  /** Printing opens the public page, so it needs a saved page */
  canPrint: boolean
}>()

const emit = defineEmits<{
  create: []
  select: [index: number]
  toggleVisibility: [index: number]
  print: [index: number]
  remove: [index: number]
}>()
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col border-r bg-white">
    <div class="flex items-center justify-between border-b px-4 py-3">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500">Tarjetas</h3>
      <button
        type="button"
        class="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-600"
        @click="emit('create')"
      >
        + Tarjeta
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <div
        v-for="(c, i) in canvases"
        :key="i"
        role="button"
        tabindex="0"
        class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-indigo-50"
        :class="{ 'bg-indigo-50 ring-1 ring-indigo-300': i === activeIndex }"
        @click="emit('select', i)"
        @keydown.enter="emit('select', i)"
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gray-200 text-xs font-bold"
          :style="{ background: c.background || '#fff', color: isDarkColor(c.background) ? '#fff' : '#6b7280' }"
        >
          {{ c.elements.length }}
        </div>
        <div class="min-w-0 flex-1" :class="{ 'opacity-50': !c.visible }">
          <span class="block truncate font-medium text-gray-800">Tarjeta {{ i + 1 }}</span>
          <span class="block text-xs text-gray-400">{{ c.width }}×{{ c.height }} · {{ c.visible ? 'visible' : 'oculta' }}</span>
        </div>

        <button
          type="button"
          class="shrink-0 rounded p-1 transition hover:text-indigo-500"
          :class="c.visible ? 'text-gray-400' : 'text-gray-300'"
          :title="c.visible ? 'Ocultar en la página pública' : 'Mostrar en la página pública'"
          @click.stop="emit('toggleVisibility', i)"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <template v-if="c.visible">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </template>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19 12 19c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.453 10.453 0 01-2.77 4.772M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65" />
          </svg>
        </button>
        <button
          v-if="canPrint"
          type="button"
          class="shrink-0 rounded p-1 text-gray-400 transition hover:text-indigo-500"
          title="Imprimir tarjeta"
          @click.stop="emit('print', i)"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
        <button
          v-if="canvases.length > 1"
          type="button"
          class="shrink-0 rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          title="Eliminar tarjeta"
          @click.stop="emit('remove', i)"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>
