<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, RouterLink, useRoute, useRouter } from 'vue-router'
import { getErrorMessage } from '@/shared/lib/http'
import { readAsDataUrl } from '@/shared/utils/files'
import { onClickOutside } from '@/shared/composables/onClickOutside'
import { useCanvas } from '../composables/useCanvas'
import { pagesService } from '../pagesService'
import { publicPageUrl } from '../urls'
import type { PageSummary } from '../types'
import EditorToolbar from '../components/editor/EditorToolbar.vue'
import EditorCanvas from '../components/editor/EditorCanvas.vue'
import CardsSidebar from '../components/editor/CardsSidebar.vue'
import CreateCardDialog from '../components/editor/CreateCardDialog.vue'
import LibrarySidebar from '../components/library/LibrarySidebar.vue'
import PropertiesPanel from '../components/panels/PropertiesPanel.vue'

const route = useRoute()
const router = useRouter()
const editor = useCanvas()
const { canvases, activeIndex, activeCanvas, selectedId, selectedElement } = editor

const pageId = ref<number | null>(null)
const pageUuid = ref('')
const title = ref('My page')
const userPages = ref<PageSummary[]>([])

const loading = ref(false)
const loadError = ref('')
const saving = ref(false)
const justSaved = ref(false)
const dirty = ref(false)

const showCards = ref(true)
const showCreateDialog = ref(false)
const showPagesMenu = ref(false)
const pagesMenu = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

onClickOutside(pagesMenu, () => (showPagesMenu.value = false))

/** Absolute indexes of the cards shown on the public page (nav targets). */
const visibleCards = computed(() =>
  canvases.value.flatMap((c, i) => (c.visible ? [i] : [])),
)

// Any edit after loading marks the page as unsaved
watch([canvases, title], () => { dirty.value = true }, { deep: true })

async function markClean() {
  await nextTick()
  dirty.value = false
}

async function loadPage(uuid: string | undefined) {
  if (uuid && uuid === pageUuid.value) return
  loadError.value = ''

  if (!uuid) {
    pageId.value = null
    pageUuid.value = ''
    title.value = 'My page'
    editor.load(undefined)
    await markClean()
    return
  }

  loading.value = true
  try {
    const page = await pagesService.get(uuid)
    pageId.value = page.id
    pageUuid.value = page.uuid
    title.value = page.title
    editor.load(page.canvases)
    await markClean()
  } catch (e) {
    loadError.value = getErrorMessage(e, 'No se pudo cargar la página')
  } finally {
    loading.value = false
  }
}

async function refreshUserPages() {
  try {
    userPages.value = await pagesService.list()
  } catch {
    // The menu is a convenience; the editor still works without it
  }
}

watch(() => route.query.uuid, (uuid) => loadPage(typeof uuid === 'string' ? uuid : undefined), { immediate: true })
onMounted(refreshUserPages)

async function save() {
  saving.value = true
  try {
    const page = await pagesService.save({ title: title.value.trim() || 'My page', canvases: canvases.value }, pageId.value)
    const isNew = !pageId.value
    pageId.value = page.id
    pageUuid.value = page.uuid
    await markClean()
    if (isNew) {
      await router.replace({ query: { uuid: page.uuid } })
    }
    justSaved.value = true
    setTimeout(() => (justSaved.value = false), 3000)
    refreshUserPages()
  } catch (e) {
    alert(getErrorMessage(e, 'Error al guardar la página'))
  } finally {
    saving.value = false
  }
}

function openPublic(params: Record<string, string> = {}) {
  if (!pageUuid.value) return
  window.open(publicPageUrl(pageUuid.value, params), '_blank', 'noopener')
}

function moveElement(id: string, x: number, y: number) {
  editor.updateElement(id, { x, y })
}

function createCard(width: number, height: number, atStart: boolean) {
  editor.insertCanvas(width, height, atStart)
  showCreateDialog.value = false
}

function addQr() {
  if (pageUuid.value) editor.addQR(publicPageUrl(pageUuid.value))
}

async function onImageSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file?.type.startsWith('image/')) {
    editor.addImage(await readAsDataUrl(file))
  }
  input.value = ''
}

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
}

async function onPaste(e: ClipboardEvent) {
  if (isTypingTarget(e.target)) return
  const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith('image/'))
  const blob = item?.getAsFile()
  if (blob) {
    e.preventDefault()
    editor.addImage(await readAsDataUrl(blob))
  }
}

function onKeydown(e: KeyboardEvent) {
  if (isTypingTarget(e.target)) return
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId.value) {
    e.preventDefault()
    editor.removeElement()
  } else if (e.key === 'Escape') {
    editor.select(null)
  } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    if (!saving.value) save()
  }
}

function onBeforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) e.preventDefault()
}

onMounted(() => {
  window.addEventListener('paste', onPaste)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('beforeunload', onBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('paste', onPaste)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('beforeunload', onBeforeUnload)
})

const confirmDiscard = () => !dirty.value || confirm('Tienes cambios sin guardar. ¿Salir de todos modos?')
onBeforeRouteLeave(confirmDiscard)
onBeforeRouteUpdate(confirmDiscard)
</script>

<template>
  <div class="flex h-screen flex-col bg-gray-50 text-gray-900">
    <header class="flex flex-wrap items-center gap-x-4 border-b bg-white px-4">
      <div class="flex items-center gap-2 py-3">
        <RouterLink to="/" class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100" title="Volver al inicio">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </RouterLink>
        <input
          v-model="title"
          maxlength="255"
          class="w-48 rounded-lg border border-transparent px-2 py-1.5 text-sm font-semibold outline-none transition hover:border-gray-200 focus:border-indigo-400"
          aria-label="Título de la página"
        />
        <div ref="pagesMenu" class="relative">
          <button
            type="button"
            class="rounded px-2 py-1 text-xs text-indigo-500 transition hover:bg-indigo-50"
            @click="showPagesMenu = !showPagesMenu"
          >
            Mis páginas ▾
          </button>
          <div v-if="showPagesMenu" class="absolute left-0 top-full z-50 mt-1 max-h-80 w-56 overflow-y-auto rounded-lg border bg-white py-1 shadow-xl">
            <RouterLink
              v-for="p in userPages"
              :key="p.id"
              :to="{ name: 'editor', query: { uuid: p.uuid } }"
              class="block truncate px-3 py-2 text-xs transition hover:bg-indigo-50"
              :class="{ 'font-semibold text-indigo-600': p.uuid === pageUuid }"
              @click="showPagesMenu = false"
            >
              {{ p.title }}
            </RouterLink>
            <hr v-if="userPages.length" class="my-1" />
            <RouterLink
              :to="{ name: 'editor' }"
              class="block px-3 py-2 text-xs text-gray-500 transition hover:bg-gray-50"
              @click="showPagesMenu = false"
            >
              + Nueva página
            </RouterLink>
          </div>
        </div>
      </div>

      <EditorToolbar
        class="flex-1"
        :has-selection="!!selectedId"
        :can-add-qr="!!pageUuid"
        @add-text="editor.addText()"
        @upload-image="fileInput?.click()"
        @add-shape="editor.addShape"
        @add-qr="addQr"
        @add-navigation="editor.addNavigation()"
        @bring-forward="selectedId && editor.shiftLayer(selectedId, 1)"
        @send-backward="selectedId && editor.shiftLayer(selectedId, -1)"
        @remove="editor.removeElement()"
      />
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onImageSelected" />

      <div class="flex items-center gap-2 py-3">
        <button
          type="button"
          class="action-btn"
          :title="showCards ? 'Ocultar tarjetas' : 'Mostrar tarjetas'"
          @click="showCards = !showCards"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <template v-if="pageUuid">
          <button type="button" class="action-btn" title="Ver página pública" @click="openPublic()">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Vista previa
          </button>
          <button type="button" class="action-btn" title="Imprimir todas las tarjetas visibles" @click="openPublic({ autoprint: '1' })">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </template>
        <button
          type="button"
          :disabled="saving || loading"
          class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          title="Guardar (Ctrl+S)"
          @click="save"
        >
          <span v-if="saving">Guardando...</span>
          <span v-else-if="justSaved">✓ Guardado</span>
          <span v-else>Guardar{{ dirty ? ' •' : '' }}</span>
        </button>
      </div>
    </header>

    <div v-if="loadError" class="flex flex-1 flex-col items-center justify-center gap-4 text-gray-500">
      <p>{{ loadError }}</p>
      <RouterLink to="/" class="text-sm text-indigo-600 hover:underline">Volver al inicio</RouterLink>
    </div>

    <div v-else-if="loading" class="flex flex-1 items-center justify-center text-gray-400">Cargando...</div>

    <div v-else class="flex flex-1 overflow-hidden">
      <CardsSidebar
        v-if="showCards"
        :canvases="canvases"
        :active-index="activeIndex"
        :can-print="!!pageUuid"
        @create="showCreateDialog = true"
        @select="editor.switchCanvas"
        @toggle-visibility="editor.toggleCanvasVisibility"
        @print="openPublic({ autoprint: '1', card: String($event) })"
        @remove="editor.removeCanvas"
      />

      <EditorCanvas
        :canvas="activeCanvas"
        :selected-id="selectedId"
        @select="editor.select"
        @move="moveElement"
        @remove="editor.removeElement"
      />

      <PropertiesPanel
        v-if="selectedElement"
        :key="selectedElement.id"
        :element="selectedElement"
        :visible-cards="visibleCards"
        @update="editor.updateElement(selectedElement.id, $event)"
        @close="editor.select(null)"
      />
      <LibrarySidebar
        v-else
        @add-image="editor.addImage"
        @add-shape="editor.addShape"
        @add-text="editor.addText"
        @add-animation="editor.addAnimation"
        @add-carousel="editor.addCarousel"
        @set-background="editor.setBackground"
      />
    </div>

    <CreateCardDialog
      v-if="showCreateDialog"
      @cancel="showCreateDialog = false"
      @confirm="createCard"
    />
  </div>
</template>

<style scoped>
.action-btn {
  @apply flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 active:scale-95;
}
</style>
