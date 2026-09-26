<template>
  <div class="flex flex-col h-full">
    <div class="mb-4">
      <label class="block text-sm font-medium text-text-muted mb-2">Subir imagen</label>
      <input
        type="file"
        accept="image/*"
        @change="handleUpload"
        class="w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white file:text-sm hover:file:bg-primary-hover"
      />
    </div>

    <div v-if="uploading" class="mb-4 text-center text-sm text-text-muted">
      Subiendo...
    </div>

    <div class="flex-1 overflow-y-auto">
      <h4 class="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Mis imágenes</h4>
      <div v-if="images.length === 0" class="text-center py-8 text-text-muted">
        No hay imágenes subidas
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="img in images"
          :key="img.id"
          class="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 cursor-pointer transition"
          @click="selectImage(img.url)"
        >
          <img :src="img.url" class="h-full w-full object-cover" :alt="img.name" />
          <button
            class="absolute top-1 right-1 rounded-full bg-red-500/90 p-1 text-white opacity-0 hover:opacity-100 transition"
            @click.stop="deleteImage(img.id)"
            title="Eliminar"
          >
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@services/api'

interface Props {
  images: { id: number; url: string; name: string }[]
}

interface Emits {
  'add-image-to-canvas': [url: string]
  refresh: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const uploading = ref(false)

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    emit('refresh')
  } catch (e) {
    console.error('Upload error:', e)
    alert('Error al subir la imagen')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function selectImage(url: string) {
  emit('add-image-to-canvas', url)
}

async function deleteImage(id: number) {
  if (!confirm('¿Eliminar esta imagen?')) return
  try {
    await api.delete(`/images/${id}`)
    emit('refresh')
  } catch (e) {
    console.error('Delete error:', e)
    alert('Error al eliminar la imagen')
  }
}
</script>