<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Initialize auth on app load
authStore.initializeAuth()
</script>

<template>
  <div class="min-h-screen">
    <RouterView />
  </div>
</template>