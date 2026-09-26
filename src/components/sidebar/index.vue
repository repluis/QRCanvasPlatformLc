<template>
  <div class="flex flex-col h-full bg-surface border-r border-border">
    <div class="border-b border-border p-3">
      <div class="flex items-center gap-2 mb-3">
        <h3 class="font-semibold text-text">Elementos</h3>
        <span class="text-xs text-text-muted">Arrastra o haz clic</span>
      </div>
      <div class="flex gap-1 overflow-x-auto pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap"
          :class="activeTab === tab.id ? 'bg-primary text-white' : 'text-text-muted hover:text-text hover:bg-surface-alt'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <ImagesTab
        v-if="activeTab === 'images'"
        :images="images"
        @add-image-to-canvas="$emit('add-image-to-canvas')"
        @refresh="loadImages"
      />
      <BackgroundsTab
        v-else-if="activeTab === 'backgrounds'"
        @set-background="$emit('set-background')"
      />
      <ShapesTab
        v-else-if="activeTab === 'shapes'"
        @add-shape="$emit('add-shape')"
      />
      <PhrasesTab
        v-else-if="activeTab === 'phrases'"
        @add-text="$emit('add-text')"
      />
      <AnimationsTab
        v-else-if="activeTab === 'animations'"
        @add-animation="$emit('add-animation')"
      />
      <CarouselTab
        v-else-if="activeTab === 'carousel'"
        @add-carousel="$emit('add-carousel')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@services/api'
import ImagesTab from './ImagesTab.vue'
import BackgroundsTab from './BackgroundsTab.vue'
import ShapesTab from './ShapesTab.vue'
import PhrasesTab from './PhrasesTab.vue'
import AnimationsTab from './AnimationsTab.vue'
import CarouselTab from './CarouselTab.vue'

interface Props {
  images: { id: number; url: string; name: string }[]
  shapes: readonly string[]
  phrases: string[]
}

interface Emits {
  'add-image-to-canvas': [url: string]
  'add-shape': [shape: string]
  'add-text': [content: string]
  'add-animation': [anim: any]
  'add-carousel': [urls: string[]]
  'set-background': [value: string]
  'refresh-images': [images: { id: number; url: string; name: string }[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref('images')

const tabs = [
  { id: 'images', label: 'Imágenes' },
  { id: 'backgrounds', label: 'Fondos' },
  { id: 'shapes', label: 'Formas' },
  { id: 'phrases', label: 'Frases' },
  { id: 'animations', label: 'Animaciones' },
  { id: 'carousel', label: 'Carrusel' },
]

async function loadImages() {
  try {
    const response = await api.get('/images')
    emit('refresh-images', response.data)
  } catch (e) {
    console.error('Load images error:', e)
  }
}

onMounted(() => {
  loadImages()
})
</script>