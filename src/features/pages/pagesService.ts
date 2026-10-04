import { http } from '@/shared/lib/http'
import type { Page, PageSummary, SavePagePayload, TemplateSummary } from './types'

export const pagesService = {
  async list() {
    const { data } = await http.get<{ data: PageSummary[] }>('/pages')
    return data.data
  },

  /** Owner view, used by the editor (works for disabled pages too). */
  async get(uuid: string) {
    const { data } = await http.get<{ data: Page }>(`/pages/${uuid}`)
    return data.data
  },

  /** Public view; 404s for disabled pages. */
  async getPublic(uuid: string) {
    const { data } = await http.get<{ data: Page }>(`/pages/public/${uuid}`)
    return data.data
  },

  async save(payload: SavePagePayload, id?: number | null) {
    const { data } = id
      ? await http.put<{ data: Page }>(`/pages/${id}`, payload)
      : await http.post<{ data: Page }>('/pages', payload)
    return data.data
  },

  async remove(id: number) {
    await http.delete(`/pages/${id}`)
  },

  async toggleStatus(id: number) {
    const { data } = await http.post<{ data: Page }>(`/pages/${id}/toggle-status`)
    return data.data
  },

  async listTemplates() {
    const { data } = await http.get<{ data: TemplateSummary[] }>('/templates')
    return data.data
  },

  async createFromTemplate(templateId: string) {
    const { data } = await http.post<{ data: Page }>(`/pages/from-template/${templateId}`)
    return data.data
  },
}
