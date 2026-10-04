import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService, type RegisterPayload, type User } from './authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  let sessionCheck: Promise<void> | null = null

  const isAuthenticated = computed(() => user.value !== null)

  /** Resolves the session once per app load (the cookie is httpOnly). */
  function ensureSession() {
    sessionCheck ??= authService
      .me()
      .then((me) => { user.value = me })
      .catch(() => { user.value = null })
    return sessionCheck
  }

  async function login(email: string, password: string) {
    user.value = await authService.login(email, password)
  }

  async function register(payload: RegisterPayload) {
    user.value = await authService.register(payload)
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }

  function clearSession() {
    user.value = null
  }

  return { user, isAuthenticated, ensureSession, login, register, logout, clearSession }
})
