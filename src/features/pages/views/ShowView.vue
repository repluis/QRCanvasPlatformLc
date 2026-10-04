<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ElementContent from '../components/canvas/ElementContent.vue'
import { pagesService } from '../pagesService'
import type { Canvas, Page } from '../types'

const route = useRoute()

const page = ref<Page | null>(null)
const notFound = ref(false)
const viewportWidth = ref(window.innerWidth)
const cardRefs = ref<HTMLElement[]>([])

/** `?card=N` (used by "print this card") shows a single card, hidden or not. */
const visibleCanvases = computed<Canvas[]>(() => {
  const canvases = page.value?.canvases ?? []
  const card = route.query.card
  if (typeof card === 'string') {
    const single = canvases[Number(card)]
    return single ? [single] : []
  }
  return canvases.filter((c) => c.visible)
})

function scaleOf(canvas: Canvas) {
  const available = Math.min(viewportWidth.value - 32, canvas.width)
  return Math.max(0.4, available / canvas.width)
}

function jumpToCard(visibleIndex: number) {
  cardRefs.value[visibleIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setCardRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) cardRefs.value[index] = el
}

function onResize() {
  viewportWidth.value = window.innerWidth
}

onMounted(async () => {
  window.addEventListener('resize', onResize)

  const uuid = route.query.uuid
  if (typeof uuid !== 'string') {
    notFound.value = true
    return
  }

  try {
    page.value = await pagesService.getPublic(uuid)
    document.title = page.value.title || 'QRCanvas'
  } catch {
    notFound.value = true
    return
  }

  if (route.query.autoprint === '1') {
    await nextTick()
    // Give images a moment to decode before the print dialog snapshots the page
    setTimeout(() => window.print(), 500)
  }
})

onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <div class="flex min-h-screen flex-col items-center gap-6 overflow-x-hidden bg-bg p-2 pt-8 sm:p-4 print:gap-4 print:bg-white print:p-2">
    <div v-if="notFound" class="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <p class="text-5xl">🔍</p>
      <h1 class="text-xl font-semibold text-text">Página no disponible</h1>
      <p class="text-sm text-text-muted">El enlace no existe o la página fue desactivada.</p>
    </div>

    <p v-else-if="!page" class="text-text-muted">Cargando...</p>

    <template v-else>
      <div
        v-for="(canvas, ci) in visibleCanvases"
        :key="ci"
        :ref="(el: unknown) => setCardRef(el, ci)"
        class="relative shrink-0 print:break-after-page"
        :style="{
          width: `${canvas.width * scaleOf(canvas)}px`,
          height: `${canvas.height * scaleOf(canvas)}px`,
          maxWidth: '100%',
        }"
      >
        <div
          class="relative overflow-hidden rounded-lg shadow-lg print:shadow-none"
          :style="{
            width: `${canvas.width}px`,
            height: `${canvas.height}px`,
            background: canvas.background,
            transform: `scale(${scaleOf(canvas)})`,
            transformOrigin: 'top left',
          }"
        >
          <div
            v-for="el in canvas.elements"
            :key="el.id"
            class="absolute select-none"
            :style="{ left: `${el.x}px`, top: `${el.y}px`, width: `${el.width}px`, height: `${el.height}px` }"
          >
            <ElementContent :element="el" interactive @navigate="jumpToCard" />
          </div>
        </div>
      </div>

      <p v-if="visibleCanvases.length === 0" class="text-text-muted">No hay tarjetas visibles</p>
    </template>
  </div>
</template>

<style>
/* Browsers drop backgrounds when printing unless told otherwise */
@media print {
  html, body, * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

@page {
  margin: 8mm;
  size: auto;
}
</style>
