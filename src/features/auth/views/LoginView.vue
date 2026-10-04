<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getErrorMessage } from '@/shared/lib/http'
import { safeRedirect } from '@/router/safeRedirect'
import BaseButton from '@/shared/components/BaseButton.vue'
import { useAuthStore } from '../authStore'
import AuthCard from '../components/AuthCard.vue'
import FormField from '../components/FormField.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const error = ref('')
const submitting = ref(false)

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    await auth.login(form.email, form.password)
    await router.replace(safeRedirect(route.query.redirect))
  } catch (e) {
    error.value = getErrorMessage(e, 'No se pudo iniciar sesión')
    form.password = ''
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthCard subtitle="Inicia sesión para continuar">
    <form class="space-y-5" @submit.prevent="submit">
      <p v-if="error" role="alert" class="rounded-lg bg-danger/10 p-3 text-sm text-danger">{{ error }}</p>

      <FormField id="email" v-model="form.email" label="Email" type="email" autocomplete="email" placeholder="email@example.com" />
      <FormField id="password" v-model="form.password" label="Contraseña" type="password" autocomplete="current-password" placeholder="••••••••" />

      <BaseButton type="submit" size="lg" class="w-full" :loading="submitting">
        {{ submitting ? 'Iniciando sesión...' : 'Iniciar sesión' }}
      </BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-text-muted">
      ¿No tienes cuenta?
      <RouterLink :to="{ name: 'register', query: route.query }" class="ml-1 font-medium text-primary underline underline-offset-2 hover:no-underline">
        Regístrate
      </RouterLink>
    </p>
  </AuthCard>
</template>
