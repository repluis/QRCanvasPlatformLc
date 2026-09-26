<template>
  <div class="flex flex-col h-full">
    <div class="mb-4">
      <label class="block text-sm font-medium text-text-muted mb-2">Crear carrusel</label>
      <input
        type="file"
        accept="image/*"
        multiple
        @change="handleImages"
        class="w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white file:text-sm hover:file:bg-primary-hover"
      />
      <p v-if="selectedImages.length > 0" class="mt-2 text-sm text-text-muted">
        {{ selectedImages.length }} imagen(es) seleccionada(s)
      </p>
      <BaseButton
        v-if="selectedImages.length > 0"
        class="mt-2 w-full"
        @click="createCarousel"
      >
        Crear carrusel
      </BaseButton>
    </div>

    <div class="flex-1">
      <h4 class="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Mis carruseles</h4>
      <div v-if="carousels.length === 0" class="text-center py-8 text-text-muted">
        No hay carruseles creados
      </div>
      <div class="space-y-2">
        <div
          v-for="(carousel, index) in carousels"
          :key="index"
          class="p-2 rounded-lg border border-border hover:bg-surface-alt cursor-pointer transition"
          @click="selectCarousel(carousel)"
        >
          <div class="flex items-center gap-2">
            <img :src="carousel.images[0]?.url" class="h-10 w-10 rounded object-cover" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text truncate">{{ carousel.images.length }} imágenes</p>
              <p class="text-xs text-text-muted">Carrusel {{ index + 1 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@components/ui/BaseButton.vue'

interface Emits {
  'add-carousel': [urls: string[]]
}

const emit = defineEmits<Emits>()

const selectedImages = ref<File[]>([])
const carousels = ref<any[]>([])

function handleImages(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  selectedImages.value = Array.from(input.files)
}

async function createCarousel() {
  const urls: string[] = []

  for (const file of selectedImages.value) {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await api.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      urls.push(response.data.url)
    } catch (e) {
      console.error('Upload error:', e)
    }
  }

  if (urls.length > 0) {
    emit('add-carousel', urls)
    selectedImages.value = []
  }
}

function selectCarousel(carousel: any) {
  emit('add-carousel', carousel.images.map((img: any) => img.url))
}
</script>