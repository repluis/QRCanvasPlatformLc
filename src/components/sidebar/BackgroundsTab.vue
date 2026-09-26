<template>
  <div class="flex flex-col h-full">
    <div class="mb-4">
      <label class="block text-sm font-medium text-text-muted mb-2">Color sólido</label>
      <input
        type="color"
        v-model="selectedColor"
        @change="applyColor"
        class="w-full h-10 rounded-lg border border-border bg-bg cursor-pointer"
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-text-muted mb-2">Gradientes</label>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="grad in gradients"
          :key="grad"
          @click="applyGradient(grad)"
          class="aspect-square rounded-lg border-2 transition"
          :style="{ background: grad }"
          :class="{ 'border-primary scale-105': currentBackground === grad }"
        ></button>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-text-muted mb-2">Imagen de fondo</label>
      <input
        type="file"
        accept="image/*"
        @change="handleBackgroundImage"
        class="w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white file:text-sm hover:file:bg-primary-hover"
      />
    </div>

    <div class="flex-1">
      <h4 class="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Patrones</h4>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="pattern in patterns"
          :key="pattern"
          @click="applyPattern(pattern)"
          class="aspect-square rounded-lg border-2 transition bg-white"
          :style="{ backgroundImage: `url(${pattern})` }"
          :class="{ 'border-primary scale-105': currentBackground === pattern }"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Emits {
  'set-background': [value: string]
}

const emit = defineEmits<Emits>()

const selectedColor = ref('#ffffff')
const currentBackground = ref('#ffffff')

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
]

const patterns = [
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSIjZTJlOGYwIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0idHJhbnNwYXJlbnQiLz48L3N2Zz4=',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybiI8L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+',
]

function applyColor() {
  currentBackground.value = selectedColor.value
  emit('set-background', selectedColor.value)
}

function applyGradient(grad: string) {
  currentBackground.value = grad
  emit('set-background', grad)
}

function applyPattern(pattern: string) {
  currentBackground.value = pattern
  emit('set-background', pattern)
}

function handleBackgroundImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    const url = e.target?.result as string
    currentBackground.value = url
    emit('set-background', url)
  }
  reader.readAsDataURL(file)
}

watch(
  () => emit,
  () => {},
  { immediate: true }
)
</script>