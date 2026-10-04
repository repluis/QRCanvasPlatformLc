<script setup lang="ts">
import { ref } from 'vue'
import ImagesTab from './ImagesTab.vue'
import ShapesTab from './ShapesTab.vue'
import PhrasesTab from './PhrasesTab.vue'
import AnimationsTab from './AnimationsTab.vue'
import CarouselTab from './CarouselTab.vue'
import BackgroundsTab from './BackgroundsTab.vue'
import type { AnimationPreset } from '../../constants/library'

const emit = defineEmits<{
  addImage: [url: string]
  addShape: [shape: string]
  addText: [content: string]
  addAnimation: [preset: AnimationPreset]
  addCarousel: [urls: string[]]
  setBackground: [value: string]
}>()

const TABS = [
  { id: 'images', label: 'Imágenes', icon: '🖼️' },
  { id: 'shapes', label: 'Formas', icon: '🔷' },
  { id: 'phrases', label: 'Frases', icon: '✏️' },
  { id: 'animations', label: 'Animación', icon: '✨' },
  { id: 'carousel', label: 'Carrusel', icon: '🎠' },
  { id: 'backgrounds', label: 'Fondos', icon: '🎨' },
] as const

type TabId = (typeof TABS)[number]['id']

const tab = ref<TabId>('images')
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col border-l bg-white">
    <nav class="flex flex-col border-b" aria-label="Biblioteca">
      <button
        v-for="t in TABS"
        :key="t.id"
        type="button"
        class="flex items-center gap-2 border-l-[3px] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition"
        :class="tab === t.id
          ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
          : 'border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'"
        :aria-pressed="tab === t.id"
        @click="tab = t.id"
      >
        <span>{{ t.icon }}</span>
        <span>{{ t.label }}</span>
      </button>
    </nav>

    <div class="flex-1 overflow-y-auto p-3">
      <ImagesTab v-if="tab === 'images'" @add-image="emit('addImage', $event)" />
      <ShapesTab v-else-if="tab === 'shapes'" @add-shape="emit('addShape', $event)" />
      <PhrasesTab v-else-if="tab === 'phrases'" @add-text="emit('addText', $event)" />
      <AnimationsTab v-else-if="tab === 'animations'" @add-animation="emit('addAnimation', $event)" />
      <CarouselTab v-else-if="tab === 'carousel'" @add-carousel="emit('addCarousel', $event)" />
      <BackgroundsTab v-else @set-background="emit('setBackground', $event)" />
    </div>
  </aside>
</template>
