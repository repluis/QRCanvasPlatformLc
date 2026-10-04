<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from '@/shared/layouts/MainLayout.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <MainLayout v-if="route.meta.layout === 'main'">
      <component :is="Component" />
    </MainLayout>
    <component :is="Component" v-else />
  </RouterView>
</template>
