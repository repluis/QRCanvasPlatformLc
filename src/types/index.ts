export interface User {
  id: number
  uuid: string
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface PageElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'qr' | 'carousel' | 'animation' | 'navigation'
  x: number
  y: number
  width: number
  height: number
  content?: string
  fontSize?: number
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: string
  fontFamily?: string
  color?: string
  shape?: string
  qrImageUrl?: string
  foregroundColor?: string
  backgroundColor?: string
  errorCorrectionLevel?: string
  images?: { id: string; url: string }[]
  animation?: string
  emoji?: string
  items?: NavigationItem[]
  buttonColor?: string
  buttonTextColor?: string
  borderRadius?: number
  gap?: number
}

export interface NavigationItem {
  label: string
  targetCard: number
}

export interface Canvas {
  elements: PageElement[]
  background: string
  width: number
  height: number
  visible: boolean
}

export interface Page {
  id: number
  uuid: string
  title: string
  slug: string
  elements: PageElement[]
  canvases: Canvas[]
  background: string
  status: boolean
  user_id: number
  created_at: string
  updated_at: string
}

export interface Template {
  id: number
  name: string
  description: string
  emoji: string
  preview_image?: string
  canvas_data: Canvas[]
}

export interface AuthUser {
  id: number
  uuid: string
  name: string
  email: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ShapeType = 'heart' | 'star' | 'circle' | 'moon' | 'diamond' | 'triangle' | 'hexagon' | 'cloud' | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down' | 'cross' | 'plus' | 'check' | 'lightning'