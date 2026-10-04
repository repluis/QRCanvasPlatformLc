interface BaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  fontSize: number
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textDecoration: 'none' | 'underline'
  textAlign: 'left' | 'center' | 'right'
  fontFamily: string
  color: string
}

export interface ImageElement extends BaseElement {
  type: 'image'
  /** URL or data URL */
  content: string
}

export interface ShapeElement extends BaseElement {
  type: 'shape'
  shape: string
  color: string
}

export interface QrElement extends BaseElement {
  type: 'qr'
  /** Text encoded in the QR (usually the public page URL) */
  content: string
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: 'low' | 'medium' | 'quartile' | 'high'
}

export interface AnimationElement extends BaseElement {
  type: 'animation'
  /** Keyframes name defined in style.css */
  animation: string
  content: string
  color: string
  fontSize: number
}

export interface CarouselElement extends BaseElement {
  type: 'carousel'
  images: { id: string; url: string }[]
}

export interface NavigationItem {
  label: string
  /** Index among the page's *visible* cards */
  targetCard: number
}

export interface NavigationElement extends BaseElement {
  type: 'navigation'
  items: NavigationItem[]
  buttonColor: string
  buttonTextColor: string
  borderRadius: number
  gap: number
}

export type CanvasElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | QrElement
  | AnimationElement
  | CarouselElement
  | NavigationElement

type EditableFields<T> = Omit<T, 'type' | 'id'>

/** Any subset of fields from any element type, used by property panels. */
export type ElementPatch = Partial<
  EditableFields<TextElement>
  & EditableFields<ImageElement>
  & EditableFields<ShapeElement>
  & EditableFields<QrElement>
  & EditableFields<AnimationElement>
  & EditableFields<CarouselElement>
  & EditableFields<NavigationElement>
>

export interface Canvas {
  elements: CanvasElement[]
  background: string
  width: number
  height: number
  visible: boolean
}

export interface PageSummary {
  id: number
  uuid: string
  title: string
  slug: string
  status: boolean
  updatedAt: string
}

export interface Page extends PageSummary {
  canvases: Canvas[]
}

export interface TemplateSummary {
  id: string
  name: string
  description: string
  emoji: string
}

export interface SavePagePayload {
  title: string
  canvases: Canvas[]
}
