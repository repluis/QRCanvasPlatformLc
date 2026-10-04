<script setup lang="ts">
defineProps<{ subtitle: string }>()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-bg px-4">
    <div class="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl">
      <h1 class="mb-2 text-center text-2xl font-bold text-text">QRCanvasPlatform</h1>
      <p class="mb-8 text-center text-sm text-text-muted">{{ subtitle }}</p>
      <slot />
    </div>
  </div>
</template>
