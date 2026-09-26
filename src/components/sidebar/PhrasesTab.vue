<template>
  <div class="flex flex-col h-full">
    <h4 class="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Frases de amor</h4>
    <div class="flex-1 overflow-y-auto space-y-1">
      <button
        v-for="phrase in phrases"
        :key="phrase"
        @click="addPhrase(phrase)"
        class="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface-alt rounded-lg transition"
      >
        {{ phrase }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LOVE_PHRASES } from '@/types/canvas'

interface Emits {
  'add-text': [content: string]
}

const emit = defineEmits<Emits>()

const phrases = LOVE_PHRASES

function addPhrase(phrase: string) {
  emit('add-text', phrase)
}
</script>