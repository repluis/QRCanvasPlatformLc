<template>
  <div class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="mb-8 text-3xl font-bold text-text">Configuración</h1>

    <div class="space-y-6">
      <div class="rounded-xl border border-border bg-surface p-6">
        <h2 class="mb-4 text-lg font-semibold text-text">Perfil</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-muted mb-1">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg border border-border bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-lg border border-border bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <BaseButton @click="updateProfile" :disabled="savingProfile">
            {{ savingProfile ? 'Guardando...' : 'Guardar cambios' }}
          </BaseButton>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-surface p-6">
        <h2 class="mb-4 text-lg font-semibold text-text">Cambiar contraseña</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-muted mb-1">Contraseña actual</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              class="w-full rounded-lg border border-border bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-muted mb-1">Nueva contraseña</label>
            <input
              v-model="passwordForm.password"
              type="password"
              class="w-full rounded-lg border border-border bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-muted mb-1">Confirmar nueva contraseña</label>
            <input
              v-model="passwordForm.password_confirmation"
              type="password"
              class="w-full rounded-lg border border-border bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <BaseButton variant="outline" @click="updatePassword" :disabled="savingPassword">
            {{ savingPassword ? 'Actualizando...' : 'Actualizar contraseña' }}
          </BaseButton>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-surface p-6">
        <h2 class="mb-4 text-lg font-semibold text-text">Preferencias</h2>
        <div class="space-y-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="preferences.darkMode" type="checkbox" class="rounded border-border text-primary focus:ring-primary" />
            <span class="text-text">Modo oscuro</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="preferences.notifications" type="checkbox" class="rounded border-border text-primary focus:ring-primary" />
            <span class="text-text">Notificaciones por email</span>
          </label>
        </div>
      </div>

      <div class="rounded-xl border border-danger bg-danger/10 p-6">
        <h2 class="mb-4 text-lg font-semibold text-danger">Zona de peligro</h2>
        <p class="mb-4 text-text-muted">Una vez eliminada, no podrás recuperar tu cuenta ni tus páginas.</p>
        <BaseButton variant="destructive" @click="confirmDeleteAccount">
          Eliminar cuenta
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@stores/auth'
import BaseButton from '@components/ui/BaseButton.vue'
import api from '@services/api'

const authStore = useAuthStore()

const form = ref({ name: '', email: '' })
const passwordForm = ref({ current_password: '', password: '', password_confirmation: '' })
const preferences = ref({ darkMode: true, notifications: true })
const savingProfile = ref(false)
const savingPassword = ref(false)

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name
    form.value.email = authStore.user.email
  }
  const savedPrefs = localStorage.getItem('preferences')
  if (savedPrefs) {
    preferences.value = JSON.parse(savedPrefs)
  }
})

async function updateProfile() {
  savingProfile.value = true
  try {
    await api.put('/user/profile', form.value)
    authStore.user = { ...authStore.user!, ...form.value }
    alert('Perfil actualizado correctamente')
  } catch (e) {
    console.error('Update profile error:', e)
    alert('Error al actualizar el perfil')
  } finally {
    savingProfile.value = false
  }
}

async function updatePassword() {
  savingPassword.value = true
  try {
    await api.put('/user/password', passwordForm.value)
    passwordForm.value = { current_password: '', password: '', password_confirmation: '' }
    alert('Contraseña actualizada correctamente')
  } catch (e) {
    console.error('Update password error:', e)
    alert('Error al actualizar la contraseña')
  } finally {
    savingPassword.value = false
  }
}

function confirmDeleteAccount() {
  if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
    if (confirm('¿Realmente seguro? Se eliminarán todas tus páginas.')) {
      deleteAccount()
    }
  }
}

async function deleteAccount() {
  try {
    await api.delete('/user/account')
    await authStore.logoutUser()
    window.location.href = '/login'
  } catch (e) {
    console.error('Delete account error:', e)
    alert('Error al eliminar la cuenta')
  }
}

watch(preferences, (val) => {
  localStorage.setItem('preferences', JSON.stringify(val))
  document.documentElement.classList.toggle('dark', val.darkMode)
}, { deep: true })
</script>