<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="border-b bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 sticky top-0 z-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-8">
          <router-link to="/" class="text-xl font-bold text-rose-500">
            QRCanvasPlatform
          </router-link>
          <nav class="hidden md:flex items-center gap-6">
            <router-link to="/" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-500">
              Dashboard
            </router-link>
            <router-link to="/canvas" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-500">
              Editor
            </router-link>
          </nav>
        </div>
        <div class="flex items-center gap-4">
          <span class="hidden sm:block text-sm text-slate-600 dark:text-slate-300">
            {{ authStore.user?.name }}
          </span>
          <BaseButton variant="ghost" size="sm" @click="handleLogout">
            Logout
          </BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>