<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg text-center">
    <p class="text-6xl font-bold text-primary">404</p>
    <p class="text-text-muted">Esta página no existe.</p>
    <RouterLink to="/" class="text-sm text-primary hover:underline">Volver al inicio</RouterLink>
  </div>
</template>
