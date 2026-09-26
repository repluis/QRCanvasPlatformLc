<template>
  <div class="flex flex-col h-full">
    <h4 class="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Animaciones</h4>
    <div class="flex-1 overflow-y-auto space-y-2">
      <div
        v-for="anim in animations"
        :key="anim.id"
        class="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-surface-alt cursor-pointer transition"
        @click="addAnimation(anim)"
      >
        <div
          class="flex-shrink-0 flex items-center justify-center"
          :style="{ fontSize: `${anim.fontSize}px`, color: anim.color, animation: `${anim.id} 2.4s ease-in-out infinite` }"
        >
          {{ anim.emoji }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-text truncate">{{ anim.name }}</p>
          <p class="text-xs text-text-muted">{{ anim.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  'add-animation': [anim: any]
}

const emit = defineEmits<Emits>()

const animations = [
  { id: 'float-heart', name: 'Corazón flotante', description: 'Corazón que sube y baja', emoji: '💖', color: '#ef4444', fontSize: 56 },
  { id: 'pulse', name: 'Pulso', description: 'Pulso suave', emoji: '✨', color: '#f59e0b', fontSize: 56 },
  { id: 'bounce', name: 'Rebote', description: 'Rebote divertido', emoji: '🎈', color: '#3b82f6', fontSize: 56 },
  { id: 'spin', name: 'Giro', description: 'Rotación continua', emoji: '🔄', color: '#8b5cf6', fontSize: 56 },
  { id: 'wiggle', name: 'Balanceo', description: 'Balanceo lateral', emoji: '🌊', color: '#06b6d4', fontSize: 56 },
  { id: 'heartbeat', name: 'Latido', description: 'Efecto de latido', emoji: '❤️', color: '#ef4444', fontSize: 56 },
  { id: 'float-star', name: 'Estrella flotante', description: 'Estrella mágica', emoji: '⭐', color: '#f59e0b', fontSize: 56 },
  { id: 'float-balloon', name: 'Globo', description: 'Globo flotando', emoji: '🎈', color: '#ec4899', fontSize: 56 },
]

function addAnimation(anim: any) {
  emit('add-animation', anim)
}
</script>