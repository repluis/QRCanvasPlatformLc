export const SHAPES = [
  'heart',
  'star',
  'circle',
  'moon',
  'diamond',
  'triangle',
  'hexagon',
  'cloud',
  'arrow-right',
  'arrow-left',
  'arrow-up',
  'arrow-down',
  'cross',
  'plus',
  'check',
  'lightning',
] as const

export type ShapeType = (typeof SHAPES)[number]

export interface ShapePath {
  [key: string]: string
}

export const SHAPE_PATHS: ShapePath = {
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  circle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  diamond: 'M12 2L2 12l10 10 10-10L12 2z',
  triangle: 'M12 2L2 22h20L12 2z',
  hexagon: 'M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z',
  cloud: 'M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
  'arrow-right': 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
  'arrow-left': 'M12 20l1.41-1.41L7.83 13H20v-2H7.83l5.58-5.59L12 4l-8 8z',
  'arrow-up': 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8z',
  'arrow-down': 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.59-5.58L4 12l8 8z',
  cross: 'M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8z',
  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  lightning: 'M13 2L3 14h7l-1 8 10-12h-7z',
}

export const LOVE_PHRASES = [
  'Te amo',
  'Eres mi todo',
  'Mi amor eterno',
  'Siempre juntos',
  'Corazón mío',
  'Eres mi vida',
  'Te quiero',
  'Para siempre',
  'Mi media naranja',
  'Amor infinito',
  'Eres única',
  'Contigo siempre',
  'Mi razón de ser',
  'Te adoro',
  'Eres mi sol',
]

export interface CanvasState {
  canvases: Canvas[]
  activeIndex: number
  selectedId: string | null
}

export interface UseCanvasReturn {
  canvases: import('vue').Ref<Canvas[]>
  activeIndex: import('vue').Ref<number>
  elements: import('vue').ComputedRef<PageElement[]>
  background: import('vue').ComputedRef<string>
  selectedId: import('vue').Ref<string | null>
  selectedElement: import('vue').ComputedRef<PageElement | null>
  SHAPES: readonly string[]
  addText: (content?: string) => void
  addImage: (url: string) => void
  addShape: (shape: ShapeType) => void
  addQR: (qrData: { text: string; image_url: string; foreground_color: string; background_color: string; error_correction_level: string }) => void
  addAnimation: (animationData: { id: string; emoji?: string; fontSize?: number; color?: string }) => void
  addCarousel: (urls: string[]) => void
  addNavigation: (items?: NavigationItem[]) => void
  removeSelected: () => void
  select: (id: string | null) => void
  updateElement: (id: string, props: Partial<PageElement>) => void
  moveElement: (id: string, dx: number, dy: number) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  clearCanvas: () => void
  setBackground: (value: string) => void
  addCanvas: (width?: number, height?: number) => void
  removeCanvas: (index: number) => void
  switchCanvas: (index: number) => void
  toggleCanvasVisibility: (index: number) => void
}

import type { PageElement, Canvas, NavigationItem } from './index'