import axios, { AxiosError } from 'axios'

// Auth travels in an httpOnly cookie set by the API; no token in JS land
export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let unauthorizedHandler: (() => void) | null = null

/** Registered by the auth store so a 401 on any request signs the user out. */
export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? ''
    const isAuthAttempt = url.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthAttempt) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)

interface ApiErrorBody {
  error?: string
  errors?: Record<string, string>
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorBody | undefined)?.error ?? fallback
  }
  return fallback
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorBody | undefined)?.errors ?? {}
  }
  return {}
}
