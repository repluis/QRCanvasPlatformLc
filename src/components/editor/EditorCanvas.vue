<template>
  <div
    class="relative flex-1 overflow-auto bg-gray-100 dark:bg-gray-900"
    @paste="handlePaste"
  >
    <div
      class="relative flex items-center justify-center min-h-full"
      :style="{ background: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }"
    >
      <div
        class="relative shadow-xl"
        :style="{
          width: canvasWidth + 'px',
          height: canvasHeight + 'px',
          background: background,
          borderRadius: '8px',
        }"
      >
        <div class="absolute inset-0">
          <div
            v-for="element in elements"
            :key="element.id"
            class="absolute select-none transition-all duration-100"
            :style="elementStyle(element)"
            :class="{ 'ring-2 ring-primary ring-offset-2': element.id === selectedId }"
            @click.stop="select(element.id)"
            @mousedown="startDrag(element.id, $event)"
            @touchstart="startDrag(element.id, $event)"
          >
            <!-- Image Element -->
            <img
              v-if="element.type === 'image'"
              :src="element.content"
              class="h-full w-full object-cover"
              draggable="false"
            />

            <!-- Shape Element -->
            <svg
              v-else-if="element.type === 'shape'"
              class="h-full w-full"
              :style="{ color: element.color }"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path :d="SHAPE_PATHS[element.shape as keyof typeof SHAPE_PATHS] || ''" />
            </svg>

            <!-- QR Element -->
            <img
              v-else-if="element.type === 'qr' && element.qrImageUrl"
              :src="element.qrImageUrl"
              class="h-full w-full rounded object-contain"
              :style="{ border: `4px solid ${element.foregroundColor || '#000000'}` }"
              draggable="false"
            />

            <!-- Carousel Element -->
            <CarouselElement
              v-else-if="element.type === 'carousel'"
              :element="element"
              :readonly="false"
              @select="select"
            />

            <!-- Animation Element -->
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

            <!-- Navigation Element -->
            <div
              v-else-if="element.type === 'navigation'"
              class="flex h-full w-full items-center gap-2"
            >
              <button
                v-for="(item, ni) in element.items"
                :key="ni"
                class="flex-shrink-0 rounded px-4 py-2 text-sm font-semibold whitespace-nowrap transition hover:opacity-80 active:scale-95 cursor-pointer"
                :style="{
                  backgroundColor: element.buttonColor || '#d97706',
                  color: element.buttonTextColor || '#ffffff',
                  borderRadius: `${element.borderRadius || 8}px`,
                }"
                @click.stop="jumpToCard(item.targetCard)"
              >
                {{ item.label }}
              </button>
            </div>

            <!-- Text Element -->
            <div
              v-else-if="element.type === 'text'"
              class="whitespace-pre-wrap"
              :style="{
                fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                fontWeight: element.fontWeight,
                fontStyle: element.fontStyle,
                textDecoration: element.textDecoration,
                textAlign: element.textAlign,
                fontFamily: element.fontFamily,
                color: element.color || '#1f2937',
              }"
            >
              {{ element.content }}
            </div>

            <!-- Resize Handles -->
            <div
              v-if="element.id === selectedId"
              class="absolute -top-2 -left-2 h-4 w-4 rounded border-2 border-primary bg-white cursor-nwse-resize"
              @mousedown.stop="startResize(element.id, 'nw', $event)"
              @touchstart.stop="startResize(element.id, 'nw', $event)"
            ></div>
            <div
              v-if="element.id === selectedId"
              class="absolute -top-2 -right-2 h-4 w-4 rounded border-2 border-primary bg-white cursor-nesw-resize"
              @mousedown.stop="startResize(element.id, 'ne', $event)"
              @touchstart.stop="startResize(element.id, 'ne', $event)"
            ></div>
            <div
              v-if="element.id === selectedId"
              class="absolute -bottom-2 -left-2 h-4 w-4 rounded border-2 border-primary bg-white cursor-nesw-resize"
              @mousedown.stop="startResize(element.id, 'sw', $event)"
              @touchstart.stop="startResize(element.id, 'sw', $event)"
            ></div>
            <div
              v-if="element.id === selectedId"
              class="absolute -bottom-2 -right-2 h-4 w-4 rounded border-2 border-primary bg-white cursor-nwse-resize"
              @mousedown.stop="startResize(element.id, 'se', $event)"
              @touchstart.stop="startResize(element.id, 'se', $event)"
            ></div>

            <!-- Delete Button -->
            <button
              v-if="element.id === selectedId"
              class="absolute -top-6 -right-6 rounded-full bg-red-500 p-1 text-white shadow-lg transition hover:bg-red-600"
              @click.stop="remove(element.id)"
              title="Eliminar"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PageElement } from '@/types'
import { SHAPE_PATHS } from '@/types/canvas'
import CarouselElement from './CarouselElement.vue'

interface Props {
  elements: PageElement[]
  selectedId: string | null
  background: string
  canvasWidth: number
  canvasHeight: number
}

interface Emits {
  select: [id: string | null]
  move: [id: string, x: number, y: number]
  resize: [id: string, width: number, height: number]
  remove: [id: string]
  deselect: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dragState = ref<{
  elementId: string | null
  startX: number
  startY: number
  startElementX: number
  startElementY: number
} | null>(null)

const resizeState = ref<{
  elementId: string | null
  handle: string
  startX: number
  startY: number
  startWidth: number
  startHeight: number
  startX_pos: number
  startY_pos: number
} | null>(null)

function elementStyle(el: PageElement) {
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

function select(id: string | null) {
  emit('select', id)
}

function remove(id: string) {
  emit('remove', id)
}

function startDrag(elementId: string, event: MouseEvent | TouchEvent) {
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const element = props.elements.find((e) => e.id === elementId)
  if (!element) return

  dragState.value = {
    elementId,
    startX: clientX,
    startY: clientY,
    startElementX: element.x,
    startElementY: element.y,
  }

  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.addEventListener('touchmove', onDragMove, { passive: false })
  document.addEventListener('touchend', onDragEnd)

  event.preventDefault()
}

function onDragMove(event: MouseEvent | TouchEvent) {
  if (!dragState.value) return

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const dx = clientX - dragState.value.startX
  const dy = clientY - dragState.value.startY

  const newX = dragState.value.startElementX + dx
  const newY = dragState.value.startElementY + dy

  emit('move', dragState.value.elementId, newX, newY)

  event.preventDefault()
}

function onDragEnd() {
  dragState.value = null
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
}

function startResize(elementId: string, handle: string, event: MouseEvent | TouchEvent) {
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const element = props.elements.find((e) => e.id === elementId)
  if (!element) return

  resizeState.value = {
    elementId,
    handle,
    startX: clientX,
    startY: clientY,
    startWidth: element.width,
    startHeight: element.height,
    startX_pos: element.x,
    startY_pos: element.y,
  }

  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
  document.addEventListener('touchmove', onResizeMove, { passive: false })
  document.addEventListener('touchend', onResizeEnd)

  event.preventDefault()
  event.stopPropagation()
}

function onResizeMove(event: MouseEvent | TouchEvent) {
  if (!resizeState.value) return

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const dx = clientX - resizeState.value.startX
  const dy = clientY - resizeState.value.startY

  let newWidth = resizeState.value.startWidth
  let newHeight = resizeState.value.startHeight
  let newX = resizeState.value.startX_pos
  let newY = resizeState.value.startY_pos

  const handle = resizeState.value.handle

  if (handle.includes('e')) {
    newWidth = Math.max(50, resizeState.value.startWidth + dx)
  } else if (handle.includes('w')) {
    newWidth = Math.max(50, resizeState.value.startWidth - dx)
    newX = resizeState.value.startX_pos + (resizeState.value.startWidth - newWidth)
  }

  if (handle.includes('s')) {
    newHeight = Math.max(50, resizeState.value.startHeight + dy)
  } else if (handle.includes('n')) {
    newHeight = Math.max(50, resizeState.value.startHeight - dy)
    newY = resizeState.value.startY_pos + (resizeState.value.startHeight - newHeight)
  }

  emit('resize', resizeState.value.elementId, newWidth, newHeight)
  emit('move', resizeState.value.elementId, newX, newY)

  event.preventDefault()
}

function onResizeEnd() {
  resizeState.value = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
  document.removeEventListener('touchmove', onResizeMove)
  document.removeEventListener('touchend', onResizeEnd)
}

function handlePaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile()
      if (blob) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const dataUrl = canvas.toDataURL('image/png')
            emit('addImage', dataUrl)
          }
          img.src = ev.target?.result as string
        }
        reader.readAsDataURL(blob)
      }
      break
    }
  }
}
</script>