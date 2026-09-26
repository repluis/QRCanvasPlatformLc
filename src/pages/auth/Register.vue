<template>
  <div class="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 mb-6">
          <svg class="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-2xl font-bold text-text">QRCanvas</span>
        </router-link>
        <h1 class="text-3xl font-bold text-text">Crear cuenta</h1>
        <p class="mt-2 text-text-muted">Únete a QRCanvasPlatform</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="error" class="rounded-lg bg-danger/10 p-3 text-sm text-danger">{{ error }}</div>

        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Nombre</label>
          <input
            v-model="form.name"
            type="text"
            required
            autocomplete="name"
            class="w-full rounded-lg border border-border bg-bg p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tu nombre"
          />
        </div>

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
            autocomplete="new-password"
            class="w-full rounded-lg border border-border bg-bg p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            minlength="8"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Confirmar contraseña</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            required
            autocomplete="new-password"
            class="w-full rounded-lg border border-border bg-bg p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-start gap-2">
          <input v-model="form.terms" type="checkbox" required id="terms" class="mt-1 rounded border-border text-primary focus:ring-primary" />
          <label for="terms" class="text-sm text-text-muted">
            Acepto los <a href="#" class="text-primary hover:underline">Términos de servicio</a> y la <a href="#" class="text-primary hover:underline">Política de privacidad</a>
          </label>
        </div>

        <BaseButton type="submit" class="w-full" :disabled="loading">
          <span v-if="loading">Creando cuenta...</span>
          <span v-else>Crear cuenta</span>
        </BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-text-muted">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="ml-1 font-medium text-primary hover:underline">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@stores/auth'
import BaseButton from '@components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ name: '', email: '', password: '', password_confirmation: '', terms: false })
const loading = ref(false)
const error = ref<string | null>(null)

async function handleRegister() {
  loading.value = true
  error.value = null

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Las contraseñas no coinciden'
    loading.value = false
    return
  }

  if (form.value.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    loading.value = false
    return
  }

  try {
    await authStore.registerUser(form.value)
    router.push('/home')
  } catch (e: any) {
    error.value = e.error || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>