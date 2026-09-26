<template>
  <div class="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
    <div class="flex items-center justify-between border-b bg-surface px-4">
      <BaseButton
        class="mr-2"
        variant="destructive"
        @click="openCreateDialog"
      >
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Crear Tarjeta
      </BaseButton>

      <EditorToolbar
        :has-selection="!!selectedId"
        :selected-type="selectedElement?.type ?? null"
        :shapes="SHAPES"
        @add-text="addText"
        @add-image="triggerFileInput"
        @add-shape="addShape"
        @add-qr="handleAddQR"
        @add-navigation="addNavigation"
        @remove="removeSelected"
        @bring-forward="bringForward(selectedId!)"
        @send-backward="sendBackward(selectedId!)"
      />

      <div class="flex items-center gap-2">
        <BaseButton variant="outline" size="icon" @click="triggerFileInput" title="Subir imagen">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </BaseButton>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />

        <BaseButton variant="outline" size="icon" @click="showPagesList = !showPagesList" :title="showPagesList ? 'Ocultar sidebar' : 'Mostrar sidebar'">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </BaseButton>

        <BaseButton
          v-if="currentUuid"
          variant="outline"
          size="icon"
          @click="viewPage"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </BaseButton>

        <BaseButton
          v-if="currentUuid"
          variant="outline"
          size="icon"
          @click="printAllVisible"
          title="Imprimir todas las tarjetas visibles"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </BaseButton>

        <BaseButton
          :disabled="saving"
          @click="handleSave"
        >
          <span v-if="saving">Guardando...</span>
          <span v-else-if="saved">✓ Guardado</span>
          <span v-else>Guardar</span>
        </BaseButton>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <div v-if="showPagesList" class="flex w-64 flex-col border-r bg-surface">
        <div class="flex items-center justify-between border-b px-4 py-3">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wider">Tarjetas</h3>
            <div class="relative" v-if="userPages.length">
              <BaseButton variant="ghost" size="sm" @click.stop="showPagesDropdown = !showPagesDropdown">
                Pages
              </BaseButton>
              <div v-if="showPagesDropdown" class="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-xl">
                <button
                  v-for="p in userPages"
                  :key="p.id"
                  class="w-full px-3 py-2 text-left text-xs transition hover:bg-surface-alt"
                  :class="{ 'font-semibold text-primary': p.uuid === currentUuid }"
                  @click="loadPage(p)"
                >
                  <span class="block truncate">{{ p.title }}</span>
                </button>
                <hr class="my-1 border-border" />
                <button class="w-full px-3 py-2 text-left text-xs text-text-muted hover:bg-surface-alt" @click="newPage">
                  + New page
                </button>
              </div>
            </div>
          </div>
          <BaseButton variant="destructive" size="sm" @click="openCreateDialog">+ Tarjeta</BaseButton>
        </div>

        <div class="flex-1 overflow-y-auto p-2">
          <div
            v-for="(c, i) in canvases"
            :key="i"
            class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-alt"
            :class="i === activeIndex ? 'bg-primary/10 ring-1 ring-primary' : ''"
            @click="switchCanvas(i)"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded border text-xs font-bold" :style="{ borderColor: 'var(--border)', background: c.background || '#fff' }">
              <span class="text-text-muted" :style="{ color: isDarkBg(c.background) ? '#fff' : '#6b7280' }">{{ c.elements.length }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <span class="block truncate font-medium text-text">Tarjeta {{ i + 1 }}</span>
              <span class="block text-xs text-text-muted">{{ c.width }}x{{ c.height }} · {{ c.elements.length }} elements</span>
            </div>
            <button class="shrink-0 rounded p-1 transition" :class="c.visible ? 'text-text-muted hover:text-primary' : 'text-text-dim'" @click.stop="toggleCanvasVisibility(i)" :title="c.visible ? 'Ocultar' : 'Mostrar'">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="c.visible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path v-if="c.visible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-if="!c.visible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19 12 19c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.453 10.453 0 01-2.77 4.772M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65" />
              </svg>
            </button>
            <BaseButton variant="ghost" size="icon" @click.stop="printCard(i)" title="Imprimir tarjeta">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </BaseButton>
            <BaseButton v-if="canvases.length > 1" variant="ghost" size="icon" class="text-text-muted hover:text-danger" @click.stop="removeCanvas(i)" title="Eliminar tarjeta">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </BaseButton>
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
          @resize="onResize"
          @remove="removeSelected"
          @deselect="onDeselect"
          @addImage="addImage"
        />

        <Sidebar
          v-if="!selectedId"
          :images="images"
          :shapes="SHAPES"
          :phrases="LOVE_PHRASES"
          @add-image-to-canvas="addImage"
          @add-shape="addShape"
          @add-text="addText"
          @add-animation="addAnimation"
          @add-carousel="addCarousel"
          @set-background="setBackground"
          @refresh-images="images = $event"
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
    </div>

    <!-- Create Canvas Dialog -->
    <div v-if="showCreateDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showCreateDialog = false">
      <div class="w-96 rounded-xl bg-surface p-6 shadow-2xl">
        <h3 class="mb-4 text-lg font-semibold text-text">Crear Nueva Tarjeta</h3>
        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-sm text-text-muted">Ancho (px)</label>
            <input v-model.number="newCanvasWidth" type="number" min="100" max="2000" class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="mb-1 block text-sm text-text-muted">Alto (px)</label>
            <input v-model.number="newCanvasHeight" type="number" min="100" max="2000" class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <label class="flex items-center gap-2 text-sm text-text-muted">
            <input v-model="createAsFirst" type="checkbox" class="rounded border-border text-primary focus:ring-primary" />
            Colocar en primer lugar
          </label>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <BaseButton variant="outline" @click="showCreateDialog = false">Cancelar</BaseButton>
          <BaseButton variant="destructive" @click="confirmCreateCanvas">Crear</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCanvas } from '@composables/useCanvas'
import { getEditorData, savePage, generateQR } from '@services/canvas'
import { useAuthStore } from '@stores/auth'
import EditorToolbar from '@components/editor/EditorToolbar.vue'
import EditorCanvas from '@components/editor/EditorCanvas.vue'
import Sidebar from '@components/sidebar/index.vue'
import TextPropertiesPanel from '@components/editor/TextPropertiesPanel.vue'
import QRPropertiesPanel from '@components/editor/QRPropertiesPanel.vue'
import NavigationPropertiesPanel from '@components/editor/NavigationPropertiesPanel.vue'
import BaseButton from '@components/ui/BaseButton.vue'
import type { Page } from '@/types'
import { SHAPES, LOVE_PHRASES } from '@/types/canvas'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const fileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)
const saved = ref(false)
const currentUuid = ref(route.query.uuid as string || '')
const currentPageId = ref<number | null>(null)
const showPagesList = ref(true)
const showPagesDropdown = ref(false)
const showCreateDialog = ref(false)
const newCanvasWidth = ref(800)
const newCanvasHeight = ref(600)
const createAsFirst = ref(true)

const origin = typeof window !== 'undefined' ? window.location.origin : ''

const images = ref<string[]>([])
const userPages = ref<Page[]>([])
const page = ref<Page | null>(null)

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
  addAnimation,
  addCarousel,
  addNavigation,
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
} = useCanvas()

async function loadEditorData() {
  try {
    const data = await getEditorData()
    images.value = data.images || []
    userPages.value = data.userPages || []
    page.value = data.page || null
    
    // Reinitialize canvas with page data
    if (page.value?.canvases) {
      canvases.value = page.value.canvases.map(c => ({
        elements: [...c.elements],
        background: c.background,
        width: c.width || 800,
        height: c.height || 600,
        visible: c.visible !== false,
      }))
    }
    
    if (page.value) {
      currentUuid.value = page.value.uuid || ''
      currentPageId.value = page.value.id || null
    }
  } catch (e) {
    console.error('Load editor data error:', e)
  }
}

onMounted(() => {
  loadEditorData()
})

// Watch for UUID changes in route to reload editor data
watch(() => route.query.uuid, (newUuid) => {
  if (newUuid) {
    loadEditorData()
  }
})

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

function onResize(id: string, width: number, height: number) {
  updateElement(id, { width, height })
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
        reader.onload = (ev) => addImage(ev.target?.result as string)
        reader.readAsDataURL(blob)
      }
      break
    }
  }
}

function handleImageUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    addImage(ev.target?.result as string)
    input.value = ''
  }
  reader.readAsDataURL(file)
}

function triggerFileInput() {
  fileInput.value?.click()
}

function loadPage(page: Page) {
  router.push(`/editor?uuid=${page.uuid}`)
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
  // Use the composable's addCanvas function which handles index correctly
  addCanvas(newCanvasWidth.value, newCanvasHeight.value)
  // The addCanvas already adds to the end and sets activeIndex to the new one
  // If we want it first, we need to move it
  if (createAsFirst.value && canvases.value.length > 1) {
    const lastCanvas = canvases.value.pop()
    if (lastCanvas) {
      canvases.value.unshift(lastCanvas)
      activeIndex.value = 0
    }
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
    currentUuid.value = res.page.uuid
    saved.value = true
    await getEditorData()
    setTimeout(() => (saved.value = false), 3000)
  } catch (e) {
    console.error('Save error:', e)
    const msg = e?.response?.data?.message || e?.message || 'Error saving page'
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

async function handleAddQR() {
  const text = origin + '/page?uuid=' + currentUuid.value
  const foreground_color = '#000000'
  const background_color = '#ffffff'
  const error_correction_level = 'medium'

  try {
    const { qr_image_url } = await generateQR({ text, foreground_color, background_color })
    addQR({
      text,
      image_url: qr_image_url,
      foreground_color,
      background_color,
      error_correction_level,
    })
  } catch (e) {
    console.error('QR generation error:', e)
    const imageUrl = getQrImageUrl(text, foreground_color, background_color, 200)
    addQR({
      text,
      image_url: imageUrl,
      foreground_color,
      background_color,
      error_correction_level,
    })
  }
}

watch(() => route.query.uuid, (newUuid) => {
  if (newUuid && newUuid !== currentUuid.value) {
    router.push(`/editor?uuid=${newUuid}`)
    window.location.reload()
  }
}, { immediate: true })
</script>