export interface User {
  id: number
  uuid: string
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface Page {
  id: number
  uuid: string
  title: string
  slug: string
  elements: CanvasElement[]
  canvases: Canvas[]
  background: string
  status: boolean
  user_id: number
  created_at: string
  updated_at: string
}

export interface Canvas {
  elements: CanvasElement[]
  background: string
  width: number
  height: number
  visible: boolean
}

export interface CanvasElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'qr' | 'navigation' | 'animation' | 'carousel'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  opacity: number
  visible: boolean
  locked: boolean
  // Text
  content?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  // Image
  src?: string
  // Shape
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line' | 'heart' | 'star'
  fill?: string
  stroke?: string
  strokeWidth?: number
  borderRadius?: number
  // QR
  qrText?: string
  qrForegroundColor?: string
  qrBackgroundColor?: string
  qrErrorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high'
  qrImageUrl?: string
  // Navigation
  targetCanvasIndex?: number
  // Animation
  animationType?: 'fade' | 'slide' | 'zoom' | 'rotate'
  animationDuration?: number
  animationDelay?: number
  // Carousel
  carouselItems?: CarouselItem[]
  carouselAutoplay?: boolean
  carouselInterval?: number
}

export interface CarouselItem {
  id: string
  elements: CanvasElement[]
  background: string
}

export interface Template {
  id: string
  name: string
  description: string
  emoji: string
  canvases: Canvas[]
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}