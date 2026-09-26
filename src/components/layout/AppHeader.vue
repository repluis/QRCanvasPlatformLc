<template>
  <header class="sticky top-0 z-40 w-full border-b bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-4">
        <router-link to="/home" class="flex items-center gap-2">
          <svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-xl font-bold text-text">QRCanvas</span>
        </router-link>
      </div>

      <nav class="hidden md:flex items-center gap-6">
        <router-link
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="text-sm font-medium text-text-muted transition-colors hover:text-text"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="flex items-center gap-4">
        <div v-if="isAuthenticated" class="flex items-center gap-3">
          <router-link to="/settings" class="text-sm text-text-muted hover:text-text">
            Settings
          </router-link>
          <div class="flex items-center gap-2">
            <span class="text-sm text-text">{{ user?.name }}</span>
            <BaseButton variant="ghost" size="icon" @click="logout">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </BaseButton>
          </div>
        </div>

        <div v-else class="flex items-center gap-2">
          <router-link to="/login" class="text-sm font-medium text-text-muted hover:text-text">
            Iniciar sesión
          </router-link>
          <router-link to="/register">
            <BaseButton size="sm">Registrarse</BaseButton>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@stores/auth'
import BaseButton from '@components/ui/BaseButton.vue'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const navLinks = [
  { href: '/home', label: 'Inicio' },
  { href: '/editor', label: 'Editor' },
]

async function logout() {
  await authStore.logoutUser()
}
</script>