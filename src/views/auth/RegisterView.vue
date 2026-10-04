<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref<Record<string, string>>({})

async function handleSubmit(e: Event) {
  e.preventDefault()
  errors.value = {}

  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    return
  }

  try {
    await authStore.register(name.value, email.value, password.value)
    router.push('/')
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
        <p class="mt-2 text-slate-500 dark:text-slate-400">Create your account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div v-if="errors.general" class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {{ errors.general }}
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="name"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="John Doe"
          />
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
            autocomplete="new-password"
            required
            minlength="8"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="••••••••"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <BaseButton type="submit" variant="primary" size="lg" class="w-full" :loading="authStore.loading">
          Create Account
        </BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?
        <router-link to="/login" class="ml-1 font-medium text-rose-500 hover:underline">
          Sign In
        </router-link>
      </p>
    </BaseCard>
  </div>
</template>