export interface TemplateCanvas {
  background: string
  width: number
  height: number
  visible: boolean
  elements: Record<string, unknown>[]
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  emoji: string
  defaultTitle: string
  canvases: TemplateCanvas[]
}
