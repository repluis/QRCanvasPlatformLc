import api from './api'
import type { Page, Canvas, PageElement } from '@/types'

export interface SavePageData {
  title: string
  slug?: string
  canvases: Canvas[]
  elements?: PageElement[]
  background?: string
  id?: number
}

export interface EditorData {
  images: string[]
  userPages: Page[]
  page?: Page
}

export async function getEditorData(): Promise<EditorData> {
  const response = await api.get('/pages/editor/data')
  return response.data
}

export async function savePage(data: SavePageData): Promise<{ page: Page }> {
  const response = await api.post('/pages', data)
  return response.data
}

export async function getPage(uuid: string): Promise<Page> {
  const response = await api.get(`/pages/${uuid}`)
  return response.data
}

export async function getTemplates(): Promise<{ templates: any[] }> {
  const response = await api.get('/templates')
  return response.data
}

export async function createPageFromTemplate(templateId: number): Promise<{ page: Page }> {
  const response = await api.post(`/pages/from-template/${templateId}`)
  return response.data
}

export async function togglePageStatus(id: number): Promise<{ page: Page }> {
  const response = await api.post(`/pages/${id}/toggle-status`)
  return response.data
}

export async function generateQR(params: { text: string; foreground_color?: string; background_color?: string; size?: number }): Promise<{ qr_image_url: string }> {
  const response = await api.post('/qr/generate', params)
  return response.data
}

export async function deletePage(id: number): Promise<void> {
  await api.delete(`/pages/${id}`)
}

export async function getUserPages(): Promise<Page[]> {
  const response = await api.get('/pages')
  return response.data
}