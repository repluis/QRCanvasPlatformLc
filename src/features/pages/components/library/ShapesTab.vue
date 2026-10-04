<script setup lang="ts">
import { SHAPE_PATHS, SHAPES } from '../../constants/shapes'

const emit = defineEmits<{ addShape: [shape: string] }>()
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="s in SHAPES"
      :key="s"
      type="button"
      class="flex flex-col items-center gap-1 rounded-lg border-2 border-transparent p-3 transition hover:border-pink-400 hover:bg-pink-50 active:scale-95"
      :title="`Agregar ${s}`"
      @click="emit('addShape', s)"
    >
      <svg class="h-7 w-7 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path :d="SHAPE_PATHS[s]" /></svg>
      <span class="text-xs capitalize text-gray-500">{{ s }}</span>
    </button>
  </div>
</template>
