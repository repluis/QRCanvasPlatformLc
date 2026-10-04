import { computed, ref } from 'vue'
import type {
  AnimationElement,
  Canvas,
  CanvasElement,
  CarouselElement,
  ElementPatch,
  ImageElement,
  NavigationElement,
  NavigationItem,
  QrElement,
  ShapeElement,
  TextElement,
} from '../types'
import type { AnimationPreset } from '../constants/library'

export const DEFAULT_CANVAS_SIZE = { width: 800, height: 600 }

export function createCanvas(width = DEFAULT_CANVAS_SIZE.width, height = DEFAULT_CANVAS_SIZE.height): Canvas {
  return { elements: [], background: '#ffffff', width, height, visible: true }
}

function newId() {
  return crypto.randomUUID()
}

/** Editor state for a multi-card page: cards, the active card and the selection. */
export function useCanvas() {
  const canvases = ref<Canvas[]>([createCanvas()])
  const activeIndex = ref(0)
  const selectedId = ref<string | null>(null)

  const activeCanvas = computed(() => canvases.value[activeIndex.value])
  const elements = computed(() => activeCanvas.value?.elements ?? [])
  const selectedElement = computed(() => elements.value.find((el) => el.id === selectedId.value) ?? null)

  function load(initial: Canvas[] | undefined) {
    canvases.value = initial?.length ? structuredClone(initial) : [createCanvas()]
    activeIndex.value = 0
    selectedId.value = null
  }

  /** Cascades new elements so they don't stack exactly on top of each other. */
  function nextPosition(step: number) {
    const offset = (elements.value.length * step) % 300
    return { x: 50 + offset, y: 50 + offset }
  }

  function add(element: CanvasElement) {
    activeCanvas.value.elements.push(element)
    selectedId.value = element.id
  }

  function addText(content = 'Texto') {
    add({
      id: newId(),
      type: 'text',
      ...nextPosition(20),
      width: 200,
      height: 40,
      content,
      fontSize: 20,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      color: '#1f2937',
    } satisfies TextElement)
  }

  function addImage(url: string) {
    add({ id: newId(), type: 'image', ...nextPosition(30), width: 150, height: 150, content: url } satisfies ImageElement)
  }

  function addShape(shape: string) {
    add({ id: newId(), type: 'shape', shape, ...nextPosition(30), width: 120, height: 120, color: '#ef4444' } satisfies ShapeElement)
  }

  function addQR(content: string) {
    add({
      id: newId(),
      type: 'qr',
      ...nextPosition(30),
      width: 150,
      height: 150,
      content,
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      errorCorrectionLevel: 'medium',
    } satisfies QrElement)
  }

  function addAnimation(preset: AnimationPreset) {
    add({
      id: newId(),
      type: 'animation',
      animation: preset.id,
      content: preset.emoji,
      ...nextPosition(30),
      width: preset.fontSize,
      height: preset.fontSize,
      color: preset.color,
      fontSize: preset.fontSize,
    } satisfies AnimationElement)
  }

  function addCarousel(urls: string[]) {
    if (urls.length === 0) return
    add({
      id: newId(),
      type: 'carousel',
      ...nextPosition(30),
      width: 300,
      height: 220,
      images: urls.map((url) => ({ id: newId(), url })),
    } satisfies CarouselElement)
  }

  function addNavigation(items?: NavigationItem[]) {
    add({
      id: newId(),
      type: 'navigation',
      x: 50,
      y: Math.max(0, activeCanvas.value.height - 100),
      width: 700,
      height: 60,
      items: items ?? [
        { label: 'Menú', targetCard: 1 },
        { label: 'Bebidas', targetCard: 2 },
        { label: 'Contacto', targetCard: 3 },
      ],
      buttonColor: '#d97706',
      buttonTextColor: '#ffffff',
      borderRadius: 8,
      gap: 10,
    } satisfies NavigationElement)
  }

  function select(id: string | null) {
    selectedId.value = id
  }

  function updateElement(id: string, patch: ElementPatch) {
    const el = elements.value.find((e) => e.id === id)
    if (el) Object.assign(el, patch)
  }

  function removeElement(id: string | null = selectedId.value) {
    if (!id) return
    activeCanvas.value.elements = elements.value.filter((el) => el.id !== id)
    if (selectedId.value === id) selectedId.value = null
  }

  /** Moves the element one step in the stacking order (+1 = forward). */
  function shiftLayer(id: string, direction: 1 | -1) {
    const arr = activeCanvas.value.elements
    const idx = arr.findIndex((e) => e.id === id)
    const target = idx + direction
    if (idx < 0 || target < 0 || target >= arr.length) return
    const [el] = arr.splice(idx, 1)
    arr.splice(target, 0, el)
  }

  function setBackground(value: string) {
    activeCanvas.value.background = value
  }

  function insertCanvas(width: number, height: number, atStart: boolean) {
    const canvas = createCanvas(width, height)
    if (atStart) {
      canvases.value.unshift(canvas)
      activeIndex.value = 0
    } else {
      canvases.value.push(canvas)
      activeIndex.value = canvases.value.length - 1
    }
    selectedId.value = null
  }

  function removeCanvas(index: number) {
    if (canvases.value.length <= 1) return
    canvases.value.splice(index, 1)
    if (activeIndex.value >= canvases.value.length) {
      activeIndex.value = canvases.value.length - 1
    }
    selectedId.value = null
  }

  function switchCanvas(index: number) {
    if (index < 0 || index >= canvases.value.length) return
    activeIndex.value = index
    selectedId.value = null
  }

  function toggleCanvasVisibility(index: number) {
    const canvas = canvases.value[index]
    if (canvas) canvas.visible = !canvas.visible
  }

  return {
    canvases,
    activeIndex,
    activeCanvas,
    elements,
    selectedId,
    selectedElement,
    load,
    addText,
    addImage,
    addShape,
    addQR,
    addAnimation,
    addCarousel,
    addNavigation,
    select,
    updateElement,
    removeElement,
    shiftLayer,
    setBackground,
    insertCanvas,
    removeCanvas,
    switchCanvas,
    toggleCanvasVisibility,
  }
}
