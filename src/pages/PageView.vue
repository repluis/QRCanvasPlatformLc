<template>
  <div class="flex min-h-screen flex-col items-center gap-6 overflow-x-hidden bg-bg p-2 pt-8 sm:p-4" :style="{ paddingTop: '2rem' }">
    <div
      v-for="(canvas, ci) in visibleCanvases"
      :key="ci"
      :ref="el => { if (el) cardRefs[ci] = el }"
      class="relative shrink-0"
      :style="{
        width: ((canvas.width || 800) * canvasScale(canvas)) + 'px',
        height: ((canvas.height || 600) * canvasScale(canvas)) + 'px',
        maxWidth: '100%',
      }"
    >
      <div
        class="relative shadow-lg overflow-hidden print:shadow-none"
        :style="{
          width: (canvas.width || 800) + 'px',
          height: (canvas.height || 600) + 'px',
          background: canvas.background || '#ffffff',
          borderRadius: '8px',
          transform: `scale(${canvasScale(canvas)})`,
          transformOrigin: 'top left',
        }"
      >
        <div class="relative h-full w-full">
          <div v-for="el in canvas.elements" :key="el.id" :style="elementStyle(el)" class="select-none">
            <img
              v-if="el.type === 'image'"
              :src="el.content"
              class="h-full w-full object-cover"
              draggable="false"
            />
            <svg
              v-else-if="el.type === 'shape'"
              class="h-full w-full"
              :style="{ color: el.color }"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path :d="SHAPE_PATHS[el.shape as keyof typeof SHAPE_PATHS] || ''" />
            </svg>
            <img
              v-else-if="el.type === 'qr' && el.qrImageUrl"
              :src="el.qrImageUrl"
              class="h-full w-full rounded object-contain"
              :style="{ border: `4px solid ${el.foregroundColor || '#000000'}` }"
              draggable="false"
            />
            <CarouselElement
              v-else-if="el.type === 'carousel'"
              :element="el"
              :readonly="true"
            />
            <div
              v-else-if="el.type === 'animation'"
              class="pointer-events-none flex h-full w-full items-center justify-center"
              :style="{
                fontSize: `${el.fontSize}px`,
                color: el.color,
                animation: `${el.animation} 2.4s ease-in-out infinite`,
                lineHeight: 1,
              }"
            >{{ el.content }}</div>
            <div
              v-else-if="el.type === 'navigation'"
              class="flex h-full w-full items-center gap-2"
            >
              <button
                v-for="(item, ni) in el.items"
                :key="ni"
                class="flex-shrink-0 rounded px-4 py-2 text-sm font-semibold whitespace-nowrap transition hover:opacity-80 active:scale-95 cursor-pointer"
                :style="{
                  backgroundColor: el.buttonColor || '#d97706',
                  color: el.buttonTextColor || '#ffffff',
                  borderRadius: `${el.borderRadius || 8}px`,
                }"
                @click="jumpToCard(item.targetCard)"
              >
                {{ item.label }}
              </button>
            </div>
            <div v-else-if="el.type === 'text'">{{ el.content }}</div>
          </div>

          <div
            v-if="!canvas.elements || canvas.elements.length === 0"
            class="absolute inset-0 flex items-center justify-center"
            :style="{ color: 'var(--text-dim)' }"
          >
            <p>Canvas {{ ci + 1 }} is empty</p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="visibleCanvases.length === 0" class="text-text-dim">No hay tarjetas visibles</p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import CarouselElement from '@components/editor/CarouselElement.vue'
import { SHAPE_PATHS } from '@/types/canvas'
import { getPage } from '@services/canvas'

defineOptions({ layout: null })

const route = useRoute()
const uuid = computed(() => route.query.uuid as string)

const page = ref<any>(null)
const loading = ref(true)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const cardRefs = ref<HTMLElement[]>([])

async function loadPage() {
  if (!uuid.value) return
  loading.value = true
  try {
    page.value = await getPage(uuid.value)
  } catch (e) {
    console.error('Load page error:', e)
    window.location.href = '/'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPage()
  window.addEventListener('resize', updateViewport)
  const params = new URLSearchParams(window.location.search)
  if (params.get('autoprint') === '1') {
    setTimeout(() => window.print(), 500)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
})

watchEffect(() => {
  if (typeof document !== 'undefined' && page.value) {
    document.title = page.value.title || 'Untitled'
  }
})

function updateViewport() {
  viewportWidth.value = window.innerWidth
}

function jumpToCard(visibleIndex: number) {
  const el = cardRefs.value[visibleIndex]
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function canvasScale(canvas: any) {
  const w = canvas.width || 800
  const maxWidth = Math.min(viewportWidth.value - 32, w)
  return Math.max(0.4, maxWidth / w)
}

const canvases = computed(() => {
  if (page.value?.canvases?.length) return page.value.canvases
  return [{ elements: page.value?.elements ?? [], background: page.value?.background ?? '#ffffff', width: 800, height: 600, visible: true }]
})

const visibleCanvases = computed(() => {
  const params = new URLSearchParams(window.location.search)
  const cardIdx = params.get('card')
  if (cardIdx !== null) {
    const c = canvases.value[Number(cardIdx)]
    return c ? [c] : []
  }
  return canvases.value.filter(c => c.visible !== false)
})

function elementStyle(el: any) {
  return {
    position: 'absolute',
    left: `${el.x}px`,
    top: `${el.y}px`,
    width: `${el.width}px`,
    height: `${el.height}px`,
    fontSize: el.fontSize ? `${el.fontSize}px` : undefined,
    fontWeight: el.fontWeight,
    fontStyle: el.fontStyle,
    textDecoration: el.textDecoration,
    textAlign: el.textAlign,
    fontFamily: el.fontFamily,
    color: el.color || '#1f2937',
  }
}

watch(uuid, () => {
  loadPage()
})
</script>

<style>
@media print {
  html, body, * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}

@page {
  margin: 8mm;
  size: auto;
}
</style>