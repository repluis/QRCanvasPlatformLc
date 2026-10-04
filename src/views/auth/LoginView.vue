<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})

const redirect = route.query.redirect as string || '/'

async function handleSubmit(e: Event) {
  e.preventDefault()
  errors.value = {}
  try {
    await authStore.login(email.value, password.value)
    router.push(redirect)
  } catch (err: unknown) {
    if (err instanceof Error) {
      errors.value.general = err.message
    }
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
    <BaseCard class="w-full max-w-md" :class="{ 'dark:bg-slate-800': true }">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-rose-500">QRCanvasPlatform</h1>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Sign in to continue</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div v-if="errors.general" class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {{ errors.general }}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <BaseButton type="submit" variant="primary" size="lg" class="w-full" :loading="authStore.loading">
          Sign In
        </BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?
        <router-link to="/register" class="ml-1 font-medium text-rose-500 hover:underline">
          Sign Up
        </router-link>
      </p>
    </BaseCard>
  </div>
</template>