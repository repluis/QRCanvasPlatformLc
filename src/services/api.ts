import axios from 'axios'
import type { User } from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
    const isAuthAttempt = url.startsWith('/auth/login') || url.startsWith('/auth/register')
    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    // Surface the server's error message instead of axios' generic one
    const serverMessage = error.response?.data?.error
    if (serverMessage) {
      error.message = serverMessage
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password })
    return response.data
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post<{ user: User; token: string }>('/auth/register', { name, email, password })
    return response.data
  },

  async logout() {
    await api.post('/auth/logout')
  },

  async getMe() {
    const response = await api.get<User>('/auth/me')
    return response.data
  },
}

export const pagesService = {
  async getUserPages() {
    const response = await api.get<{ data: any[] }>('/pages')
    return response.data.data
  },

  async getPage(uuid: string) {
    const response = await api.get<{ data: any }>(`/pages/${uuid}`)
    return response.data.data
  },

  async createPage(data: any) {
    const response = await api.post<{ data: any }>('/pages', data)
    return response.data.data
  },

  async updatePage(id: number, data: any) {
    const response = await api.put<{ data: any }>(`/pages/${id}`, data)
    return response.data.data
  },

  async deletePage(id: number) {
    await api.delete(`/pages/${id}`)
  },

  async togglePageStatus(id: number) {
    const response = await api.post<{ data: any }>(`/pages/${id}/toggle-status`)
    return response.data.data
  },

  async getTemplates() {
    const response = await api.get<{ data: any[] }>('/templates')
    return response.data.data
  },

  async createFromTemplate(templateId: string) {
    const response = await api.post<{ data: any }>(`/pages/from-template/${templateId}`)
    return response.data.data
  },
}

export const qrService = {
  async generate(data: any) {
    const response = await api.post<{ image_url: string; text: string }>('/qr/generate', data)
    return response.data
  },
}

export async function savePage(data: any) {
  if (data.id) {
    return pagesService.updatePage(data.id, data)
  }
  return pagesService.createPage(data)
}