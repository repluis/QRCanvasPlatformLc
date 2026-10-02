<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  images: string[]
  shapes: { type: string; name: string; icon: string }[]
  phrases: string[]
}

const props = defineProps<Props>()

defineEmits<{
  'add-image-to-canvas': [src: string]
  'add-shape': [type: string]
  'add-text': [text: string]
  'add-animation': []
  'add-carousel': []
  'set-background': [bg: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const activeTab = ref<'images' | 'shapes' | 'text' | 'backgrounds'>('images')
const backgrounds = ['#ffffff', '#fef2f2', '#fefce8', '#f0fdf4', '#f0f9ff', '#faf5ff', '#fdf4ff', '#1e293b', '#0f172a']

function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (ev) => {
    emit('add-image-to-canvas', ev.target!.result as string)
    activeTab.value = 'images'
  }
  reader.readAsDataURL(file)
  ;(e.target as HTMLInputElement).value = ''
}

const LOVE_PHRASES = [
  'Te amo', 'Eres mi todo', 'Mi amor eterno', 'Siempre juntos',
  'Corazón mío', 'Eres mi vida', 'Te quiero', 'Para siempre',
  'Mi media naranja', 'Amor infinito', 'Eres única', 'Contigo siempre',
  'Mi razón de ser', 'Te adoro', 'Eres mi sol',
]
</script>

<template>
  <div class="w-72 flex flex-col border-l bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
    <div class="flex border-b border-slate-200 dark:border-slate-700">
      <button
        v-for="tab in ['images', 'shapes', 'text', 'backgrounds']"
        :key="tab"
        :class="[
          'flex-1 py-2 text-sm font-medium transition',
          activeTab === tab
            ? 'text-rose-500 border-b-2 border-rose-500'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
        ]"
        @click="activeTab = tab"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-3">
      <!-- Images Tab -->
      <div v-if="activeTab === 'images'" class="space-y-3">
        <button
          class="w-full flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          @click="fileInput?.click()"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Image
        </button>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

        <div v-if="images.length > 0" class="grid grid-cols-3 gap-2">
          <button
            v-for="img in images"
            :key="img"
            class="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 hover:ring-2 hover:ring-rose-500 transition"
            @click="emit('add-image-to-canvas', img)"
          >
            <img :src="img" alt="" class="w-full h-full object-cover" />
          </button>
        </div>

        <p v-else class="text-sm text-slate-400 text-center py-8">No images uploaded yet</p>
      </div>

      <!-- Shapes Tab -->
      <div v-if="activeTab === 'shapes'" class="space-y-2">
        <button
          v-for="shape in shapes"
          :key="shape.type"
          class="w-full flex items-center gap-3 rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          @click="emit('add-shape', shape.type)"
        >
          <span class="text-2xl">{{ shape.icon }}</span>
          <span>{{ shape.name }}</span>
        </button>
      </div>

      <!-- Text Tab -->
      <div v-if="activeTab === 'text'" class="space-y-2">
        <button
          v-for="phrase in phrases"
          :key="phrase"
          class="w-full text-left rounded-lg p-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition truncate"
          @click="emit('add-text', phrase)"
        >
          {{ phrase }}
        </button>
        <button
          v-for="phrase in LOVE_PHRASES"
          :key="'love-' + phrase"
          class="w-full text-left rounded-lg p-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition truncate"
          @click="emit('add-text', phrase)"
        >
          {{ phrase }}
        </button>
      </div>

      <!-- Backgrounds Tab -->
      <div v-if="activeTab === 'backgrounds'" class="space-y-3">
        <button
          v-for="bg in backgrounds"
          :key="bg"
          class="w-full aspect-[4/3] rounded-lg border-2 transition"
          :style="{ backgroundColor: bg, borderColor: bg === '#ffffff' ? '#e5e7eb' : 'transparent' }"
          @click="emit('set-background', bg)"
        >
          <div v-if="bg === '#ffffff'" class="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            White
          </div>
        </button>
      </div>
    </div>

    <div class="border-t border-slate-200 dark:border-slate-700 p-3 space-y-2">
      <button
        @click="emit('add-animation')"
        class="w-full flex items-center gap-2 rounded-lg p-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Add Animation
      </button>
      <button
        @click="emit('add-carousel')"
        class="w-full flex items-center gap-2 rounded-lg p-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Add Carousel
      </button>
    </div>
  </div>
</template>