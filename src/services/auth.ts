import api from './api'
import type { User, LoginCredentials, RegisterData, AuthUser } from '@/types'

export interface LoginResponse {
  user: AuthUser
  token: string
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export async function register(data: RegisterData): Promise<LoginResponse> {
  const response = await api.post('/auth/register', data)
  return response.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function getMe(): Promise<{ user: AuthUser }> {
  const response = await api.get('/auth/me')
  return response.data
}

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token)
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function removeAuthToken() {
  localStorage.removeItem('auth_token')
  delete api.defaults.headers.common['Authorization']
}

export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem('auth_user', JSON.stringify(user))
}

export function getStoredUser(): AuthUser | null {
  const user = localStorage.getItem('auth_user')
  return user ? JSON.parse(user) : null
}

export function clearAuth() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  delete api.defaults.headers.common['Authorization']
}