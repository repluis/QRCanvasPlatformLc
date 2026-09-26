<template>
  <div class="flex min-h-screen items-center justify-center bg-bg px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 mb-6">
          <svg class="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-2xl font-bold text-text">QRCanvas</span>
        </router-link>
        <h1 class="text-3xl font-bold text-text">Iniciar sesión</h1>
        <p class="mt-2 text-text-muted">Bienvenido de nuevo</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="error" class="rounded-lg bg-danger/10 p-3 text-sm text-danger">{{ error }}</div>

        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-lg border border-border bg-bg p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-lg border border-border bg-bg p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.remember" type="checkbox" class="rounded border-border text-primary focus:ring-primary" />
            <span class="text-sm text-text-muted">Recordarme</span>
          </label>
          <a href="#" class="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</a>
        </div>

        <BaseButton type="submit" class="w-full" :disabled="loading">
          <span v-if="loading">Iniciando sesión...</span>
          <span v-else>Iniciar sesión</span>
        </BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-text-muted">
        ¿No tienes cuenta?
        <router-link to="/register" class="ml-1 font-medium text-primary hover:underline">Regístrate</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@stores/auth'
import BaseButton from '@components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({ email: '', password: '', remember: false })
const loading = ref(false)
const error = ref<string | null>(null)

async function handleLogin() {
  loading.value = true
  error.value = null

  try {
    await authStore.loginUser(form.value)
    const redirect = route.query.redirect as string || '/home'
    router.push(redirect)
  } catch (e: any) {
    error.value = e.error || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>