<script setup lang="ts">
import { LOVE_PHRASES } from '../../constants/library'

const emit = defineEmits<{ addText: [content: string] }>()
</script>

<template>
  <div class="space-y-2">
    <button
      v-for="phrase in LOVE_PHRASES"
      :key="phrase"
      type="button"
      class="w-full rounded-lg border-2 border-transparent px-4 py-3 text-left text-sm text-gray-700 transition hover:border-rose-300 hover:bg-rose-50 active:scale-95"
      @click="emit('addText', phrase)"
    >
      {{ phrase }}
    </button>
  </div>
</template>
