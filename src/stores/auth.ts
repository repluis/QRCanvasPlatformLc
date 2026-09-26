import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '@/types'
import { login, register, logout, getMe, setAuthToken, removeAuthToken, getStoredToken, setStoredUser, getStoredUser, clearAuth } from '@services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(getStoredUser())
  const token = ref<string | null>(getStoredToken())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function loginUser(credentials: { email: string; password: string }) {
    loading.value = true
    error.value = null
    try {
      const { user: userData, token: tokenData } = await login(credentials)
      user.value = userData
      token.value = tokenData
      setAuthToken(tokenData)
      setStoredUser(userData)
      return { success: true }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function registerUser(data: { name: string; email: string; password: string; password_confirmation: string }) {
    loading.value = true
    error.value = null
    try {
      const { user: userData, token: tokenData } = await register(data)
      user.value = userData
      token.value = tokenData
      setAuthToken(tokenData)
      setStoredUser(userData)
      return { success: true }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al registrarse'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logoutUser() {
    try {
      await logout()
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      clearAuth()
      user.value = null
      token.value = null
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const { user: userData } = await getMe()
      user.value = userData
      setStoredUser(userData)
    } catch (e) {
      clearAuth()
      user.value = null
      token.value = null
    }
  }

  function initializeAuth() {
    if (token.value && !user.value) {
      fetchUser()
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    fetchUser,
    initializeAuth,
  }
})