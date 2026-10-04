<script setup lang="ts">
import { ANIMATIONS, type AnimationPreset } from '../../constants/library'

const emit = defineEmits<{ addAnimation: [preset: AnimationPreset] }>()
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-gray-400">Elementos con animación CSS: se reproducen continuamente al ver la página.</p>
    <button
      v-for="a in ANIMATIONS"
      :key="a.id"
      type="button"
      class="flex w-full items-center gap-3 rounded-lg border-2 border-transparent px-3 py-2 text-left transition hover:border-indigo-400 hover:bg-indigo-50 active:scale-95"
      :title="`Agregar ${a.label}`"
      @click="emit('addAnimation', a)"
    >
      <span class="inline-block text-2xl" :style="{ color: a.color, animation: `${a.id} 2.4s ease-in-out infinite` }">
        {{ a.emoji }}
      </span>
      <span class="flex-1 text-sm font-medium text-gray-700">{{ a.label }}</span>
    </button>
  </div>
</template>
