import { http } from '@/shared/lib/http'

export interface User {
  id: number
  uuid: string
  name: string
  email: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await http.post<{ user: User }>('/auth/login', { email, password })
    return data.user
  },

  async register(payload: RegisterPayload) {
    const { data } = await http.post<{ user: User }>('/auth/register', payload)
    return data.user
  },

  async logout() {
    await http.post('/auth/logout')
  },

  async me() {
    const { data } = await http.get<{ user: User }>('/auth/me')
    return data.user
  },
}
