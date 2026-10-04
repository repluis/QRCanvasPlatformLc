<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import ElementContent from '../canvas/ElementContent.vue'
import type { CanvasElement } from '../../types'

const props = defineProps<{
  element: CanvasElement
  selected: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  move: [id: string, x: number, y: number]
  remove: [id: string]
}>()

const dragging = ref(false)
let stopDragging: (() => void) | null = null

const style = computed(() => ({
  left: `${props.element.x}px`,
  top: `${props.element.y}px`,
  width: `${props.element.width}px`,
  height: `${props.element.height}px`,
  zIndex: props.selected ? 1000 : 'auto',
  cursor: dragging.value ? 'grabbing' : 'grab',
}))

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  e.stopPropagation()
  emit('select', props.element.id)

  const start = { x: e.clientX, y: e.clientY }
  const origin = { x: props.element.x, y: props.element.y }
  dragging.value = true

  function onPointerMove(ev: PointerEvent) {
    emit('move', props.element.id, Math.round(origin.x + ev.clientX - start.x), Math.round(origin.y + ev.clientY - start.y))
  }

  stopDragging = () => {
    dragging.value = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', stopDragging!)
    stopDragging = null
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDragging)
}

onBeforeUnmount(() => stopDragging?.())
</script>

<template>
  <div
    class="absolute select-none rounded"
    :class="selected ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:ring-1 hover:ring-indigo-300'"
    :style="style"
    @pointerdown="onPointerDown"
  >
    <ElementContent :element="element" />

    <button
      v-if="selected"
      type="button"
      class="absolute -right-2 -top-2 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow hover:bg-red-600"
      title="Eliminar"
      @pointerdown.stop
      @click.stop="emit('remove', element.id)"
    >
      ×
    </button>
  </div>
</template>
