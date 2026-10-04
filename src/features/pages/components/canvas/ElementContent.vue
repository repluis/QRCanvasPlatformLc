<script setup lang="ts">
import QrImage from '@/features/qr/QrImage.vue'
import CarouselView from './CarouselView.vue'
import { SHAPE_PATHS } from '../../constants/shapes'
import type { CanvasElement } from '../../types'

/**
 * Renders the inside of any element. Shared by the editor and the public view
 * so both look identical; positioning is the parent's job.
 */
withDefaults(defineProps<{
  element: CanvasElement
  /** Navigation buttons are only clickable in the public view */
  interactive?: boolean
}>(), { interactive: false })

const emit = defineEmits<{ navigate: [targetCard: number] }>()
</script>

<template>
  <img
    v-if="element.type === 'image'"
    :src="element.content"
    class="pointer-events-none h-full w-full rounded object-cover"
    draggable="false"
    alt=""
  />

  <svg
    v-else-if="element.type === 'shape'"
    class="pointer-events-none h-full w-full"
    viewBox="0 0 24 24"
    fill="currentColor"
    :style="{ color: element.color }"
  >
    <path :d="SHAPE_PATHS[element.shape] ?? ''" />
  </svg>

  <QrImage
    v-else-if="element.type === 'qr'"
    :text="element.content"
    :foreground="element.foregroundColor"
    :background="element.backgroundColor"
    :level="element.errorCorrectionLevel"
    class="pointer-events-none h-full w-full rounded object-contain"
    :style="{ border: `4px solid ${element.foregroundColor}` }"
  />

  <CarouselView v-else-if="element.type === 'carousel'" :element="element" />

  <div
    v-else-if="element.type === 'animation'"
    class="pointer-events-none flex h-full w-full items-center justify-center"
    :style="{
      fontSize: `${element.fontSize}px`,
      color: element.color,
      animation: `${element.animation} 2.4s ease-in-out infinite`,
      lineHeight: 1,
    }"
  >
    {{ element.content }}
  </div>

  <div
    v-else-if="element.type === 'navigation'"
    class="flex h-full w-full items-center"
    :class="{ 'pointer-events-none': !interactive }"
    :style="{ gap: `${element.gap ?? 8}px` }"
  >
    <button
      v-for="(item, i) in element.items"
      :key="i"
      type="button"
      class="shrink-0 whitespace-nowrap px-4 py-2 text-sm font-semibold transition"
      :class="{ 'cursor-pointer hover:opacity-80 active:scale-95': interactive }"
      :style="{
        backgroundColor: element.buttonColor ?? '#d97706',
        color: element.buttonTextColor ?? '#ffffff',
        borderRadius: `${element.borderRadius ?? 8}px`,
      }"
      :tabindex="interactive ? 0 : -1"
      @click="emit('navigate', item.targetCard)"
    >
      {{ item.label }}
    </button>
  </div>

  <div
    v-else-if="element.type === 'text'"
    class="pointer-events-none flex h-full w-full items-center rounded px-2"
    :style="{
      fontSize: `${element.fontSize}px`,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      textDecoration: element.textDecoration,
      textAlign: element.textAlign,
      justifyContent: element.textAlign === 'left' ? 'flex-start' : element.textAlign === 'right' ? 'flex-end' : 'center',
      fontFamily: element.fontFamily,
      color: element.color,
    }"
  >
    {{ element.content }}
  </div>
</template>
