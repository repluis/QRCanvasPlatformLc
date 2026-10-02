<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface Props {
  page: any
}

defineProps<Props>()

const currentSlide = ref(0)
const autoprint = ref(false)
const printCardIndex = ref<number | null>(null)

function getAriaLabel(index: number) {
  return `Go to card ${index + 1}`
}

function isDarkBg(bg: string) {
  if (!bg || bg === '#ffffff') return false
  const hex = bg.replace('#', '')
  if (hex.length < 6) return false
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 < 128
}

const visibleCanvases = computed(() => props.page.canvases.filter((c: any) => c.visible))
const currentCanvas = computed(() => visibleCanvases.value[currentSlide.value])

function getCanvasStyle(canvas: any) {
  return {
    width: `${canvas.width}px`,
    height: `${canvas.height}px`,
    backgroundColor: canvas.background || '#ffffff',
    backgroundImage: canvas.background?.startsWith('url(') ? canvas.background : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

function getElementStyle(element: any) {
  return {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: `rotate(${element.rotation || 0}deg)`,
    opacity: element.opacity ?? 1,
    zIndex: element.zIndex || 0,
    pointerEvents: 'none',
  }
}

function getBorderRadius(element: any) {
  return element.type === 'shape' && element.borderRadius ? `${element.borderRadius}px` : '0'
}

function getShapeBorder(element: any) {
  return element.type === 'shape' && element.stroke !== 'transparent' 
    ? `${element.strokeWidth}px solid ${element.stroke}` 
    : 'none'
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % visibleCanvases.value.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + visibleCanvases.value.length) % visibleCanvases.value.length
}

function goToSlide(index: number) {
  currentSlide.value = index
}

onMounted(() => {
  autoprint.value = route.query.autoprint === '1'
  printCardIndex.value = route.query.card ? parseInt(route.query.card as string) : null

  if (autoprint.value) {
    setTimeout(() => window.print(), 500)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900 py-12 px-4">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">{{ page.title }}</h1>
        <p class="mt-2 text-slate-500 dark:text-slate-400">
          {{
            page.canvases.length > 1
              ? `Showing card ${currentSlide + 1} of ${visibleCanvases.length}`
              : 'Single card view'
          }}
        </p>
      </div>

      <!-- Page Cards -->
      <div class="space-y-8">
        <div
          v-for="(canvas, index) in page.canvases"
          :key="index"
          v-if="page.canvases.length === 1 || canvas.visible || (printCardIndex !== null && printCardIndex === index)"
          class="relative"
        >
          <div
            class="mx-auto shadow-2xl rounded-xl overflow-hidden"
            :style="getCanvasStyle(canvas)"
          >
            <div class="relative w-full h-full" style="min-height: 100%;">
              <div
                v-for="element in canvas.elements"
                :key="element.id"
                :style="getElementStyle(element)"
              >
                <!-- Text Element -->
                <div
                  v-if="element.type === 'text'"
                  class="w-full h-full flex"
                  :style="{
                    alignItems: 'center',
                    justifyContent: element.textAlign === 'left' ? 'flex-start' : element.textAlign === 'right' ? 'flex-end' : 'center',
                    padding: '4px',
                    fontSize: (element.fontSize || 24) + 'px',
                    fontFamily: element.fontFamily || 'Instrument Sans',
                    fontWeight: element.fontWeight || 'normal',
                    color: element.color || '#111827',
                    textAlign: element.textAlign || 'left',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }"
                >
                  {{ element.content }}
                </div>

                <!-- Image Element -->
                <img
                  v-else-if="element.type === 'image'"
                  :src="element.src"
                  alt=""
                  class="w-full h-full"
                  style="object-fit: cover; border-radius: 4px;"
                />

                <!-- Shape Element -->
                <div
                  v-else-if="element.type === 'shape'"
                  class="w-full h-full"
                  :style="{
                    backgroundColor: element.fill,
                    border: getShapeBorder(element),
                    borderRadius: getBorderRadius(element),
                  }"
                />

                <!-- QR Element -->
                <img
                  v-else-if="element.type === 'qr'"
                  :src="element.qrImageUrl"
                  alt="QR Code"
                  class="w-full h-full"
                  style="object-fit: contain;"
                />

                <!-- Navigation Element -->
                <div
                  v-else-if="element.type === 'navigation'"
                  class="w-full h-full flex items-center justify-center"
                  :style="{
                    backgroundColor: element.fill,
                    color: element.color,
                    fontSize: element.fontSize + 'px',
                    fontFamily: element.fontFamily,
                    fontWeight: element.fontWeight,
                    borderRadius: element.borderRadius + 'px',
                  }"
                >
                  {{ element.content }}
                </div>

                <!-- Carousel Element -->
                <div
                  v-else-if="element.type === 'carousel'"
                  class="w-full h-full flex items-center justify-center"
                  style="border: 2px dashed #ec4899; border-radius: 8px; color: #ec4899;"
                >
                  Carousel ({{ element.carouselItems?.length || 0 }} slides)
                </div>

                <!-- Default -->
                <div v-else class="w-full h-full" />
              </div>
            </div>
          </div>

          <!-- Navigation indicators -->
          <div v-if="page.canvases.length > 1 && page.canvases.length <= 10" class="mt-4 flex justify-center gap-2">
            <button
              v-for="(c, i) in visibleCanvases"
              :key="i"
              class="w-2 h-2 rounded-full transition"
              :class="i === currentSlide ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'"
              @click="goToSlide(i)"
              :aria-label="getAriaLabel(i)"
            />
          </div>

          <!-- Navigation arrows -->
          <div v-if="page.canvases.length > 1" class="mt-4 flex justify-center gap-4">
            <button
              class="rounded-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              @click="prevSlide"
              :disabled="currentSlide === 0"
              aria-label="Previous card"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="flex items-center text-sm text-slate-500 dark:text-slate-400">
              {{ currentSlide + 1 }} / {{ visibleCanvases.length }}
            </span>
            <button
              class="rounded-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              @click="nextSlide"
              :disabled="currentSlide === visibleCanvases.length - 1"
              aria-label="Next card"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Share/Print actions -->
      <div class="mt-12 flex flex-wrap justify-center gap-4">
        <button
          class="rounded-lg bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-rose-600"
          @click="window.print()"
        >
          Print / Save as PDF
        </button>
        <button
          class="rounded-lg border border-slate-300 dark:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow transition hover:bg-slate-50 dark:hover:bg-slate-800"
          @click="navigator.clipboard.writeText(window.location.href)"
        >
          Copy Link
        </button>
      </div>
    </div>
  </div>
</template>