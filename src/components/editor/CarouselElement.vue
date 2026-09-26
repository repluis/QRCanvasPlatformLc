<template>
  <div class="relative h-full w-full overflow-hidden rounded-lg">
    <div
      class="flex h-full transition-transform duration-300 ease-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(img, i) in element.images"
        :key="i"
        class="relative shrink-0 w-full h-full"
      >
        <img
          :src="img.url"
          class="h-full w-full object-cover"
          draggable="false"
        />
      </div>
    </div>

    <button
      v-if="element.images.length > 1 && !readonly"
      class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
      @click.stop="prev"
      aria-label="Anterior"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      v-if="element.images.length > 1 && !readonly"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
      @click.stop="next"
      aria-label="Siguiente"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <div
      v-if="element.images.length > 1"
      class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
    >
      <button
        v-for="(_, i) in element.images"
        :key="i"
        class="h-2 w-2 rounded-full transition"
        :class="i === currentIndex ? 'bg-white' : 'bg-white/50'"
        @click.stop="goTo(i)"
        :aria-label="`Ir a imagen ${i + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PageElement } from '@/types'

interface Props {
  element: PageElement
  readonly?: boolean
}

interface Emits {
  select: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentIndex = ref(0)

function next() {
  if (props.element.images && props.element.images.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % props.element.images.length
  }
}

function prev() {
  if (props.element.images && props.element.images.length > 1) {
    currentIndex.value = (currentIndex.value - 1 + props.element.images.length) % props.element.images.length
  }
}

function goTo(index: number) {
  currentIndex.value = index
}
</script>