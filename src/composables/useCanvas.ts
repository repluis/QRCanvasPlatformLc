import { ref, computed, watch } from 'vue'
import type { Canvas, CanvasElement } from '@/types'

export function useCanvas(initialCanvases?: Canvas[]) {
  const canvases = ref<Canvas[]>(
    initialCanvases?.length
      ? initialCanvases.map(c => ({
          ...c,
          elements: c.elements || [],
          background: c.background || '#ffffff',
          width: c.width || 800,
          height: c.height || 600,
          visible: c.visible !== false,
        }))
      : [{ elements: [], background: '#ffffff', width: 800, height: 600, visible: true }]
  )

  const activeIndex = ref(0)
  const selectedId = ref<string | null>(null)

  const elements = computed(() => canvases.value[activeIndex.value]?.elements || [])
  const background = computed({
    get: () => canvases.value[activeIndex.value]?.background || '#ffffff',
    set: (value) => {
      if (canvases.value[activeIndex.value]) {
        canvases.value[activeIndex.value].background = value
      }
    },
  })

  const selectedElement = computed(() =>
    elements.value.find(el => el.id === selectedId.value) || null
  )

  const SHAPES = [
    { type: 'rectangle', name: 'Rectangle', icon: '▭' },
    { type: 'circle', name: 'Circle', icon: '⬤' },
    { type: 'triangle', name: 'Triangle', icon: '▲' },
    { type: 'heart', name: 'Heart', icon: '♥' },
    { type: 'star', name: 'Star', icon: '★' },
  ]

  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function select(id: string | null) {
    selectedId.value = id
  }

  function addText() {
    const newElement: CanvasElement = {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: Date.now(),
      opacity: 1,
      visible: true,
      locked: false,
      content: 'New Text',
      fontSize: 24,
      fontFamily: 'Instrument Sans',
      fontWeight: 'normal',
      color: '#111827',
      textAlign: 'left',
    }
    elements.value.push(newElement)
    select(newElement.id)
  }

  function addImage(src: string) {
    const newElement: CanvasElement = {
      id: generateId(),
      type: 'image',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: Date.now(),
      opacity: 1,
      visible: true,
      locked: false,
      src,
    }
    elements.value.push(newElement)
    select(newElement.id)
  }

  function addShape(shapeType: CanvasElement['shapeType'] = 'rectangle') {
    const newElement: CanvasElement = {
      id: generateId(),
      type: 'shape',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: Date.now(),
      opacity: 1,
      visible: true,
      locked: false,
      shapeType,
      fill: '#ec4899',
      stroke: 'transparent',
      strokeWidth: 0,
      borderRadius: shapeType === 'rectangle' ? 8 : 0,
    }
    elements.value.push(newElement)
    select(newElement.id)
  }

  function addQR(config: { text: string; image_url: string; foreground_color: string; background_color: string; error_correction_level: string }) {
    const newElement: CanvasElement = {
      id: generateId(),
      type: 'qr',
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      rotation: 0,
      zIndex: Date.now(),
      opacity: 1,
      visible: true,
      locked: false,
      qrText: config.text,
      qrImageUrl: config.image_url,
      qrForegroundColor: config.foreground_color,
      qrBackgroundColor: config.background_color,
      qrErrorCorrectionLevel: config.error_correction_level as CanvasElement['qrErrorCorrectionLevel'],
    }
    elements.value.push(newElement)
    select(newElement.id)
  }

  function addNavigation() {
    const newElement: CanvasElement = {
      id: generateId(),
      type: 'navigation',
      x: 50,
      y: 50,
      width: 120,
      height: 40,
      rotation: 0,
      zIndex: Date.now(),
      opacity: 1,
      visible: true,
      locked: false,
      content: 'Next Page',
      fontSize: 16,
      fontFamily: 'Instrument Sans',
      fontWeight: 'bold',
      color: '#ffffff',
      fill: '#ec4899',
      textAlign: 'center',
      targetCanvasIndex: (activeIndex.value + 1) % canvases.value.length,
      borderRadius: 8,
    }
    elements.value.push(newElement)
    select(newElement.id)
  }

  function addAnimation() {
    // Animation is applied to selected element
    if (selectedElement.value) {
      selectedElement.value.animationType = 'fade'
      selectedElement.value.animationDuration = 500
      selectedElement.value.animationDelay = 0
    }
  }

  function addCarousel() {
    const newElement: CanvasElement = {
      id: generateId(),
      type: 'carousel',
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      rotation: 0,
      zIndex: Date.now(),
      opacity: 1,
      visible: true,
      locked: false,
      carouselItems: [
        { id: generateId(), elements: [], background: '#ffffff' },
        { id: generateId(), elements: [], background: '#ffffff' },
      ],
      carouselAutoplay: true,
      carouselInterval: 3000,
    }
    elements.value.push(newElement)
    select(newElement.id)
  }

  function removeSelected() {
    if (selectedId.value) {
      const index = elements.value.findIndex(el => el.id === selectedId.value)
      if (index !== -1) {
        elements.value.splice(index, 1)
        selectedId.value = null
      }
    }
  }

  function updateElement(id: string, props: Partial<CanvasElement>) {
    const element = elements.value.find(el => el.id === id)
    if (element) {
      Object.assign(element, props)
    }
  }

  function moveElement(id: string, x: number, y: number) {
    const element = elements.value.find(el => el.id === id)
    if (element) {
      element.x = x
      element.y = y
    }
  }

  function bringForward(id: string) {
    const element = elements.value.find(el => el.id === id)
    if (element) {
      const maxZ = Math.max(...elements.value.map(e => e.zIndex))
      element.zIndex = maxZ + 1
    }
  }

  function sendBackward(id: string) {
    const element = elements.value.find(el => el.id === id)
    if (element) {
      const minZ = Math.min(...elements.value.map(e => e.zIndex))
      element.zIndex = minZ - 1
    }
  }

  function clearCanvas() {
    elements.value = []
    selectedId.value = null
  }

  function setBackground(bg: string) {
    background.value = bg
  }

  function addCanvas(canvas?: Partial<Canvas>) {
    const newCanvas: Canvas = {
      elements: [],
      background: '#ffffff',
      width: 800,
      height: 600,
      visible: true,
      ...canvas,
    }
    canvases.value.push(newCanvas)
    activeIndex.value = canvases.value.length - 1
  }

  function removeCanvas(index: number) {
    if (canvases.value.length <= 1) return
    canvases.value.splice(index, 1)
    if (activeIndex.value >= canvases.value.length) {
      activeIndex.value = canvases.value.length - 1
    }
  }

  function switchCanvas(index: number) {
    if (index >= 0 && index < canvases.value.length) {
      activeIndex.value = index
      selectedId.value = null
    }
  }

  function toggleCanvasVisibility(index: number) {
    if (canvases.value[index]) {
      canvases.value[index].visible = !canvases.value[index].visible
    }
  }

  // Persist to localStorage for recovery
  watch(canvases, (newCanvases) => {
    localStorage.setItem('canvas-backup', JSON.stringify(newCanvases))
  }, { deep: true })

  return {
    canvases,
    activeIndex,
    elements,
    background,
    selectedId,
    selectedElement,
    SHAPES,
    select,
    addText,
    addImage,
    addShape,
    addQR,
    addNavigation,
    addAnimation,
    addCarousel,
    removeSelected,
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
  }
}