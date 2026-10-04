<script setup lang="ts">
import { readImageFiles } from '@/shared/utils/files'

const emit = defineEmits<{ addCarousel: [urls: string[]] }>()

async function onFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const urls = await readImageFiles(input.files)
  if (urls.length > 0) emit('addCarousel', urls)
  input.value = ''
}
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs text-gray-400">
      Sube 2 o más fotos para crear un carrusel. Luego podrás pasar las fotos con las flechas ◀ ▶.
    </p>
    <label
      class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-indigo-300 px-4 py-6 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Subir fotos
      <input type="file" accept="image/*" multiple class="sr-only" @change="onFiles" />
    </label>
  </div>
</template>
