<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/authStore'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-bg text-text">
    <header class="sticky top-0 z-40 border-b border-border bg-bg">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <nav class="flex items-center gap-6">
          <RouterLink to="/" class="text-lg font-bold text-primary">QRCanvas</RouterLink>
          <RouterLink :to="{ name: 'editor' }" class="hidden text-sm text-text-muted transition hover:text-text sm:block">
            Editor
          </RouterLink>
        </nav>
        <div class="flex items-center gap-3">
          <span class="text-sm text-text-muted">{{ auth.user?.name }}</span>
          <button
            type="button"
            class="rounded-lg border border-border bg-surface-alt px-3 py-1.5 text-xs font-medium text-text-muted transition hover:text-text"
            @click="logout"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-border py-6 text-center text-xs text-text-dim">
      &copy; {{ new Date().getFullYear() }} QRCanvasPlatform. All rights reserved.
    </footer>
  </div>
</template>
