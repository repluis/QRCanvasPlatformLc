<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePagesStore } from '@/stores/pages'
import { useCanvas } from '@/composables/useCanvas'
import { savePage } from '@/services/pages'
import EditorToolbar from '@/components/editor/EditorToolbar.vue'
import EditorCanvas from '@/components/editor/EditorCanvas.vue'
import ImageLibrary from '@/components/sidebar/ImageLibrary.vue'
import TextPropertiesPanel from '@/components/editor/TextPropertiesPanel.vue'
import QRPropertiesPanel from '@/components/editor/QRPropertiesPanel.vue'
import NavigationPropertiesPanel from '@/components/editor/NavigationPropertiesPanel.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const pagesStore = usePagesStore()

const props = defineProps<{
  images: string[]
  userPages: any[]
  page: any
}>()

defineOptions({ layout: 'editor' })

const LOVE_PHRASES = [
  'Te amo', 'Eres mi todo', 'Mi amor eterno', 'Siempre juntos',
  'Corazón mío', 'Eres mi vida', 'Te quiero', 'Para siempre',
  'Mi media naranja', 'Amor infinito', 'Eres única', 'Contigo siempre',
  'Mi razón de ser', 'Te adoro', 'Eres mi sol',
]

const fileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)
const saved = ref(false)
const currentUuid = ref(props.page?.uuid || '')
const currentPageId = ref(props.page?.id || null)
const showPagesList = ref(true)
const showPagesDropdown = ref(false)
const showCreateDialog = ref(false)
const newCanvasWidth = ref(800)
const newCanvasHeight = ref(600)
const createAsFirst = ref(true)

const origin = typeof window !== 'undefined' ? window.location.origin : ''

const {
  canvases,
  activeIndex,
  elements,
  background,
  selectedId,
  selectedElement,
  SHAPES,
  addText,
  addImage,
  addShape,
  addQR,
  addNavigation,
  addAnimation,
  addCarousel,
  removeSelected,
  select,
  updateElement,
  moveElement,
  bringForward,
  sendBackward,
  clearCanvas,
  setBackground,
  addCanvas,
  removeCanvas,
  switchCanvas,
  toggleCanvasVisibility,
} = useCanvas(props.page?.canvases)

function isDarkBg(bg: string) {
  if (!bg || bg === '#ffffff') return false
  const hex = bg.replace('#', '')
  if (hex.length < 6) return false
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 < 128
}

function onMove(id: string, x: number, y: number) {
  updateElement(id, { x, y })
}

function onDeselect() {
  select(null)
}

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile()
      if (blob) {
        const reader = new FileReader()
        reader.onload = (ev) => addImage(ev.target!.result as string)
        reader.readAsDataURL(blob)
      }
      break
    }
  }
}

function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    addImage(ev.target!.result as string)
    ;(e.target as HTMLInputElement).value = ''
  }
  reader.readAsDataURL(file)
}

function loadPage(page: any) {
  router.push(`/canvas?uuid=${page.uuid}`)
}

function newPage() {
  currentUuid.value = ''
  currentPageId.value = null
  canvases.value = [{ elements: [], background: '#ffffff', width: 800, height: 600, visible: true }]
  activeIndex.value = 0
}

function openCreateDialog() {
  newCanvasWidth.value = 800
  newCanvasHeight.value = 600
  createAsFirst.value = true
  showCreateDialog.value = true
}

function confirmCreateCanvas() {
  const newCanvas = { elements: [], background: '#ffffff', width: newCanvasWidth.value, height: newCanvasHeight.value, visible: true }
  if (createAsFirst.value) {
    canvases.value.unshift(newCanvas)
    activeIndex.value = 0
  } else {
    canvases.value.push(newCanvas)
    activeIndex.value = canvases.value.length - 1
  }
  selectedId.value = null
  showCreateDialog.value = false
}

async function handleSave() {
  saving.value = true
  saved.value = false
  try {
    const slug = currentUuid.value || 'page-' + Date.now()
    const data = {
      title: 'My page',
      canvases: canvases.value.map(c => ({
        elements: c.elements,
        background: c.background,
        width: c.width,
        height: c.height,
        visible: c.visible,
      })),
      slug,
    }
    if (currentPageId.value) {
      data.id = currentPageId.value
    }
    const res = await savePage(data)
    currentUuid.value = res.uuid
    currentPageId.value = res.id
    saved.value = true
    await pagesStore.fetchUserPages()
    setTimeout(() => (saved.value = false), 3000)
  } catch (e: unknown) {
    console.error('Save error:', e)
    const msg = e instanceof Error ? e.message : 'Error saving page'
    alert(msg)
  } finally {
    saving.value = false
  }
}

function viewPage() {
  if (currentUuid.value) {
    window.open(`/page?uuid=${currentUuid.value}`, '_blank')
  }
}

function printCard(index: number) {
  if (!currentUuid.value) return
  window.open(`/page?uuid=${currentUuid.value}&autoprint=1&card=${index}`, '_blank')
}

function printAllVisible() {
  if (!currentUuid.value) return
  window.open(`/page?uuid=${currentUuid.value}&autoprint=1`, '_blank')
}

function getQrImageUrl(text: string, fg = '000000', bg = 'ffffff', size = 200) {
  return `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=${size}&margin=2&dark=${fg.replace('#', '')}&light=${bg.replace('#', '')}`
}

function handleAddQR(qrConfig: any) {
  const imageUrl = getQrImageUrl(qrConfig.text, qrConfig.foreground_color, qrConfig.background_color, 200)
  addQR({
    text: qrConfig.text,
    image_url: imageUrl,
    foreground_color: qrConfig.foreground_color,
    background_color: qrConfig.background_color,
    error_correction_level: qrConfig.error_correction_level,
  })
}

onMounted(() => {
  if (props.page?.uuid && props.page.uuid !== currentUuid.value) {
    currentUuid.value = props.page.uuid
    currentPageId.value = props.page.id
  }
})

watch(() => props.page?.uuid, (newUuid) => {
  if (newUuid && newUuid !== currentUuid.value) {
    currentUuid.value = newUuid
    currentPageId.value = props.page.id
  }
})
</script>

<template>
  <div class="flex h-screen flex-col bg-slate-50 dark:bg-slate-900">
    <div class="flex items-center justify-between border-b bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-4">
      <button
        class="mr-2 flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 active:scale-95"
        @click="openCreateDialog"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Crear Tarjeta
      </button>
      <EditorToolbar
        :has-selection="!!selectedId"
        :selected-type="selectedElement?.type ?? null"
        :shapes="SHAPES"
        @add-text="addText"
        @add-image="addImage"
        @add-shape="addShape"
        @add-qr="handleAddQR({ text: origin + '/page?uuid=' + currentUuid, foreground_color: '#000000', background_color: '#ffffff', error_correction_level: 'medium' })"
        @add-navigation="addNavigation"
        @remove="removeSelected"
        @bring-forward="bringForward(selectedId)"
        @send-backward="sendBackward(selectedId)"
      />
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
          @click="fileInput?.click()"
          title="Upload image"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />
        <button
          class="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
          @click="showPagesList = !showPagesList"
          :title="showPagesList ? 'Hide sidebar' : 'Show sidebar'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          v-if="currentUuid"
          class="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
          @click="viewPage"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
        <button
          v-if="currentUuid"
          class="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
          @click="printAllVisible"
          title="Imprimir todas las tarjetas visibles"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir todas
        </button>
        <button
          :disabled="saving"
          class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          @click="handleSave"
        >
          <span v-if="saving">Saving...</span>
          <span v-else-if="saved">✓ Saved</span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden" @paste="handlePaste">
      <div
        v-if="showPagesList"
        class="flex w-64 flex-col border-r bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      >
        <div class="flex items-center justify-between border-b px-4 py-3 border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tarjetas</h3>
            <div class="relative" v-if="props.userPages.length">
              <button
                class="rounded px-2 py-0.5 text-xs text-indigo-500 transition hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                @click.stop="showPagesDropdown = !showPagesDropdown"
              >
                Pages
              </button>
              <div
                v-if="showPagesDropdown"
                class="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border bg-white dark:bg-slate-800 py-1 shadow-xl border-slate-200 dark:border-slate-700"
              >
                <button
                  v-for="p in props.userPages"
                  :key="p.id"
                  class="w-full px-3 py-2 text-left text-xs transition hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  :class="{ 'font-semibold text-indigo-600': p.uuid === currentUuid }"
                  @click="loadPage(p)"
                >
                  <span class="block truncate">{{ p.title }}</span>
                </button>
                <hr class="my-1 border-slate-200 dark:border-slate-700" />
                <button
                  class="w-full px-3 py-2 text-left text-xs text-slate-500 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                  @click="newPage"
                >
                  + New page
                </button>
              </div>
            </div>
          </div>
          <button
            class="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-600"
            @click="openCreateDialog"
          >
            + Tarjeta
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-2">
          <div
            v-for="(c, i) in canvases"
            :key="i"
            class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            :class="i === activeIndex ? 'bg-indigo-50 ring-1 ring-indigo-300 dark:bg-indigo-900/20' : ''"
            @click="switchCanvas(i)"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded border text-xs font-bold"
              :style="{ borderColor: 'var(--border)', background: c.background || '#fff' }"
            >
              <span class="text-slate-500 dark:text-slate-400" :style="{ color: isDarkBg(c.background) ? '#fff' : '#6b7280' }">
                {{ c.elements.length }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <span class="block truncate font-medium text-slate-800 dark:text-slate-200">Tarjeta {{ i + 1 }}</span>
              <span class="block text-xs text-slate-400">{{ c.width }}x{{ c.height }} · {{ c.elements.length }} elements</span>
            </div>
            <button
              type="button"
              class="shrink-0 rounded p-1 transition"
              :class="c.visible ? 'text-slate-300 hover:text-indigo-500' : 'text-slate-200'"
              @click.stop="toggleCanvasVisibility(i)"
              :title="c.visible ? 'Hide' : 'Show'"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="c.visible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path v-if="c.visible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-if="!c.visible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19 12 19c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.453 10.453 0 01-2.77 4.772M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65" />
              </svg>
            </button>
            <button
              type="button"
              class="shrink-0 rounded p-1 text-slate-300 transition hover:text-indigo-500"
              @click.stop="printCard(i)"
              title="Imprimir tarjeta"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            <button
              v-if="canvases.length > 1"
              type="button"
              class="shrink-0 rounded p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              @click.stop="removeCanvas(i)"
              title="Delete canvas"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col overflow-hidden" @paste="handlePaste">
        <EditorCanvas
          :key="activeIndex"
          :elements="elements"
          :selected-id="selectedId"
          :background="background"
          :canvas-width="canvases[activeIndex]?.width || 800"
          :canvas-height="canvases[activeIndex]?.height || 600"
          @select="select"
          @move="onMove"
          @remove="removeSelected"
          @deselect="onDeselect"
          @update:element="updateElement"
        />
      </div>

      <ImageLibrary
        v-if="!selectedId"
        :images="props.images"
        :shapes="SHAPES"
        :phrases="LOVE_PHRASES"
        @add-image-to-canvas="addImage"
        @add-shape="addShape"
        @add-text="addText"
        @add-animation="addAnimation"
        @add-carousel="addCarousel"
        @set-background="setBackground"
      />

      <TextPropertiesPanel
        v-if="selectedElement?.type === 'text' || selectedElement?.type === 'shape'"
        :element="selectedElement"
        @update="updateElement"
      />

      <QRPropertiesPanel
        v-if="selectedElement?.type === 'qr'"
        :element="selectedElement"
        @update="updateElement"
      />

      <NavigationPropertiesPanel
        v-if="selectedElement?.type === 'navigation'"
        :element="selectedElement"
        :total-cards="canvases.length"
        @update="updateElement"
      />
    </div>

    <div
      v-if="showCreateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showCreateDialog = false"
    >
      <div class="w-96 rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl">
        <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Crear Nueva Tarjeta</h3>

        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-sm text-slate-500 dark:text-slate-400">Ancho (px)</label>
            <input
              v-model.number="newCanvasWidth"
              type="number"
              min="100"
              max="2000"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm text-slate-500 dark:text-slate-400">Alto (px)</label>
            <input
              v-model.number="newCanvasHeight"
              type="number"
              min="100"
              max="2000"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>
          <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input v-model="createAsFirst" type="checkbox" class="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500" />
            Colocar en primer lugar
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            class="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
            @click="showCreateDialog = false"
          >
            Cancelar
          </button>
          <button
            class="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
            @click="confirmCreateCanvas"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>