<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CanvasElement } from '@/types'

interface Props {
  elements: CanvasElement[]
  selectedId: string | null
  background: string
  canvasWidth: number
  canvasHeight: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [id: string | null]
  move: [id: string, x: number, y: number]
  remove: [id: string]
  deselect: []
  'update:element': [element: CanvasElement]
}>()

const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const dragState = ref<{ element: CanvasElement; startX: number; startY: number } | null>(null)
const resizeState = ref<{ element: CanvasElement; handle: string; startX: number; startY: number; startW: number; startH: number } | null>(null)

function isDarkBg(bg: string) {
  if (!bg || bg === '#ffffff') return false
  const hex = bg.replace('#', '')
  if (hex.length < 6) return false
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 < 128
}

function getElementStyle(element: CanvasElement) {
  const isSelected = element.id === props.selectedId
  return {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    zIndex: element.zIndex,
    pointerEvents: element.locked ? 'none' : 'auto',
    outline: isSelected ? '2px solid #ec4899' : 'none',
    outlineOffset: isSelected ? '2px' : '0',
    borderRadius: element.type === 'shape' && element.borderRadius ? `${element.borderRadius}px` : '0',
    backgroundColor: element.type === 'shape' ? element.fill : 'transparent',
    border: element.type === 'shape' && element.stroke !== 'transparent' ? `${element.strokeWidth}px solid ${element.stroke}` : 'none',
  }
}

function getHandleStyle(handle: string) {
  const size = 8
  const styles: Record<string, Record<string, string>> = {
    nw: { top: '-4px', left: '-4px', cursor: 'nwse-resize' },
    n: { top: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' },
    ne: { top: '-4px', right: '-4px', cursor: 'nesw-resize' },
    e: { top: 'calc(50% - 4px)', right: '-4px', cursor: 'ew-resize' },
    se: { bottom: '-4px', right: '-4px', cursor: 'nwse-resize' },
    s: { bottom: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' },
    sw: { bottom: '-4px', left: '-4px', cursor: 'nesw-resize' },
    w: { top: 'calc(50% - 4px)', left: '-4px', cursor: 'ew-resize' },
  }
  return { ...styles[handle], width: `${size}px`, height: `${size}px`, background: '#ec4899', border: '2px solid white', borderRadius: '50%' }
}

function onMouseDown(e: MouseEvent, element: CanvasElement) {
  if (element.locked) return
  e.stopPropagation()
  emit('select', element.id)

  const canvasEl = e.currentTarget as HTMLElement
  const rect = canvasEl.getBoundingClientRect()
  dragState.value = {
    element,
    startX: e.clientX - rect.left,
    startY: e.clientY - rect.top,
  }
}

function onHandleMouseDown(e: MouseEvent, element: CanvasElement, handle: string) {
  if (element.locked) return
  e.stopPropagation()
  e.preventDefault()

  const canvasEl = e.currentTarget as HTMLElement
  const rect = canvasEl.getBoundingClientRect()
  resizeState.value = {
    element,
    handle,
    startX: e.clientX - rect.left,
    startY: e.clientY - rect.top,
    startW: element.width,
    startH: element.height,
  }
}

function onMouseMove(e: MouseEvent) {
  const canvasEl = e.currentTarget as HTMLElement
  const rect = canvasEl.getBoundingClientRect()
  const clientX = e.clientX - rect.left
  const clientY = e.clientY - rect.top

  if (dragState.value) {
    const { element, startX, startY } = dragState.value
    const newX = Math.max(0, Math.min(clientX - startX + element.x, props.canvasWidth - element.width))
    const newY = Math.max(0, Math.min(clientY - startY + element.y, props.canvasHeight - element.height))
    emit('move', element.id, newX, newY)
  }

  if (resizeState.value) {
    const { element, handle, startX, startY, startW, startH } = resizeState.value
    const dx = clientX - startX
    const dy = clientY - startY

    let newW = startW
    let newH = startH
    let newX = element.x
    let newY = element.y

    if (handle.includes('e')) newW = Math.max(20, startW + dx)
    if (handle.includes('w')) {
      newW = Math.max(20, startW - dx)
      newX = element.x + (startW - newW)
    }
    if (handle.includes('s')) newH = Math.max(20, startH + dy)
    if (handle.includes('n')) {
      newH = Math.max(20, startH - dy)
      newY = element.y + (startH - newH)
    }

    emit('update:element', { ...element, x: newX, y: newY, width: newW, height: newH })
  }
}

function onMouseUp() {
  dragState.value = null
  resizeState.value = null
}

function deselect() {
  emit('deselect')
}

function onKeyDown(e: KeyboardEvent) {
  if ((e.key === 'Delete' || e.key === 'Backspace') && props.selectedId) {
    emit('remove', props.selectedId)
  }
}

function renderElementContent(element: CanvasElement) {
  const isDark = isDarkBg(props.background)

  if (element.type === 'text') {
    return h('div', {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: element.textAlign === 'left' ? 'flex-start' : element.textAlign === 'right' ? 'flex-end' : 'center',
        padding: '4px',
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        color: element.color,
        textAlign: element.textAlign,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        outline: 'none',
      },
      contentEditable: true,
      onInput: (e: Event) => emit('update:element', { ...element, content: (e.target as HTMLElement).innerText }),
    }, element.content)
  }

  if (element.type === 'image') {
    return h('img', {
      src: element.src,
      alt: '',
      style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' },
    })
  }

  if (element.type === 'shape') {
    return h('div', { style: { width: '100%', height: '100%' } })
  }

  if (element.type === 'qr') {
    return h('img', {
      src: element.qrImageUrl,
      alt: 'QR Code',
      style: { width: '100%', height: '100%', objectFit: 'contain' },
    })
  }

  if (element.type === 'navigation') {
    return h('div', {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: element.fill,
        color: element.color,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        borderRadius: `${element.borderRadius}px`,
        cursor: 'pointer',
      },
    }, element.content)
  }

  if (element.type === 'carousel') {
    return h('div', {
      style: { width: '100%', height: '100%', border: '2px dashed #ec4899', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' },
    }, `Carousel (${element.carouselItems?.length || 0} slides)`)
  }

  return h('div', { style: { width: '100%', height: '100%' } })
}

import { h } from 'vue'
</script>

<template>
  <div
    class="relative flex-1 overflow-hidden"
    :style="{ backgroundColor: background, width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
    @click="deselect"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @keydown="onKeyDown"
    tabindex="0"
  >
    <div class="absolute inset-0" style="transform-origin: top left;">
      <div
        v-for="element in elements"
        :key="element.id"
        :style="getElementStyle(element)"
        class="select-none"
        @mousedown="(e) => onMouseDown(e, element)"
      >
        <component :is="() => renderElementContent(element)" />

        <div v-if="element.id === selectedId && !element.locked" class="absolute inset-0" style="pointer-events: none;">
          <div
            v-for="handle in handles"
            :key="handle"
            class="absolute"
            :style="getHandleStyle(handle)"
            @mousedown="(e) => onHandleMouseDown(e, element, handle)"
          />
        </div>
      </div>
    </div>
  </div>
</template>