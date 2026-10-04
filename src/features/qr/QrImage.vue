<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import QRCode from 'qrcode'

type Level = 'low' | 'medium' | 'quartile' | 'high'

const props = withDefaults(defineProps<{
  text: string
  foreground?: string
  background?: string
  level?: Level
  size?: number
}>(), {
  foreground: '#000000',
  background: '#ffffff',
  level: 'medium',
  size: 400,
})

const LEVELS: Record<Level, QRCode.QRCodeErrorCorrectionLevel> = {
  low: 'L',
  medium: 'M',
  quartile: 'Q',
  high: 'H',
}

const dataUrl = ref('')

// Rendered locally, so no third-party QR service is needed
watchEffect(async () => {
  if (!props.text) {
    dataUrl.value = ''
    return
  }
  try {
    dataUrl.value = await QRCode.toDataURL(props.text, {
      width: props.size,
      margin: 2,
      errorCorrectionLevel: LEVELS[props.level] ?? 'M',
      color: { dark: props.foreground, light: props.background },
    })
  } catch {
    dataUrl.value = ''
  }
})
</script>

<template>
  <img v-if="dataUrl" :src="dataUrl" :alt="`QR: ${text}`" draggable="false" />
  <div v-else class="flex items-center justify-center text-xs text-gray-400">No QR</div>
</template>
