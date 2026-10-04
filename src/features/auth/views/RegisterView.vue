<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getErrorMessage, getFieldErrors } from '@/shared/lib/http'
import { safeRedirect } from '@/router/safeRedirect'
import BaseButton from '@/shared/components/BaseButton.vue'
import { useAuthStore } from '../authStore'
import AuthCard from '../components/AuthCard.vue'
import FormField from '../components/FormField.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const errors = ref<Record<string, string>>({})
const generalError = ref('')
const submitting = ref(false)

function validate() {
  const found: Record<string, string> = {}
  if (form.name.trim().length < 2) found.name = 'El nombre debe tener al menos 2 caracteres'
  if (form.password.length < 8) found.password = 'La contraseña debe tener al menos 8 caracteres'
  if (form.password !== form.password_confirmation) found.password_confirmation = 'Las contraseñas no coinciden'
  return found
}

async function submit() {
  generalError.value = ''
  errors.value = validate()
  if (Object.keys(errors.value).length) return

  submitting.value = true
  try {
    await auth.register({ name: form.name, email: form.email, password: form.password })
    await router.replace(safeRedirect(route.query.redirect))
  } catch (e) {
    errors.value = getFieldErrors(e)
    if (!Object.keys(errors.value).length) {
      generalError.value = getErrorMessage(e, 'No se pudo crear la cuenta')
    }
    form.password = ''
    form.password_confirmation = ''
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthCard subtitle="Crea tu cuenta">
    <form class="space-y-5" novalidate @submit.prevent="submit">
      <p v-if="generalError" role="alert" class="rounded-lg bg-danger/10 p-3 text-sm text-danger">{{ generalError }}</p>

      <FormField id="name" v-model="form.name" label="Nombre" autocomplete="name" placeholder="Tu nombre" :error="errors.name" />
      <FormField id="email" v-model="form.email" label="Email" type="email" autocomplete="email" placeholder="email@example.com" :error="errors.email" />
      <FormField id="password" v-model="form.password" label="Contraseña" type="password" autocomplete="new-password" placeholder="••••••••" :error="errors.password" />
      <FormField
        id="password_confirmation"
        v-model="form.password_confirmation"
        label="Confirmar contraseña"
        type="password"
        autocomplete="new-password"
        placeholder="••••••••"
        :error="errors.password_confirmation"
      />

      <BaseButton type="submit" size="lg" class="w-full" :loading="submitting">
        {{ submitting ? 'Creando cuenta...' : 'Crear cuenta' }}
      </BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-text-muted">
      ¿Ya tienes cuenta?
      <RouterLink :to="{ name: 'login', query: route.query }" class="ml-1 font-medium text-primary underline underline-offset-2 hover:no-underline">
        Inicia sesión
      </RouterLink>
    </p>
  </AuthCard>
</template>
