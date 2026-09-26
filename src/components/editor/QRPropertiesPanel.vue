<template>
  <div class="fixed right-0 top-16 bottom-0 w-72 border-l bg-surface overflow-y-auto p-4 shadow-xl z-30">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-text">Propiedades del QR</h3>
      <button @click="$emit('close')" class="text-text-muted hover:text-text">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-text-muted mb-1">Contenido / URL</label>
        <textarea
          v-model="localContent"
          @input="updateContent"
          class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows="3"
          placeholder="Texto o URL para el código QR"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Color principal</label>
          <input
            type="color"
            v-model="localForegroundColor"
            @change="updateForegroundColor"
            class="w-full h-10 rounded-lg border border-border bg-bg cursor-pointer"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-muted mb-1">Color de fondo</label>
          <input
            type="color"
            v-model="localBackgroundColor"
            @change="updateBackgroundColor"
            class="w-full h-10 rounded-lg border border-border bg-bg cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-muted mb-1">Nivel de corrección</label>
        <select
          v-model="localErrorCorrectionLevel"
          @change="updateErrorCorrectionLevel"
          class="w-full rounded-lg border border-border bg-bg p-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="low">Bajo (L) - 7%</option>
          <option value="medium">Medio (M) - 15%</option>
          <option value="quartile">Cuartil (Q) - 25%</option>
          <option value="high">Alto (H) - 30%</option>
        </select>
      </div>

      <div class="pt-4 border-t border-border">
        <label class="block text-sm font-medium text-text-muted mb-2">Vista previa</label>
        <div class="flex justify-center">
          <div class="p-4 bg-white rounded-lg shadow">
            <img
              v-if="qrImageUrl"
              :src="qrImageUrl"
              class="h-32 w-32 object-contain"
              alt="Vista previa del QR"
            />
            <p v-else class="text-center text-text-muted py-8">Generando QR...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { PageElement } from '@/types'
import { generateQR } from '@services/canvas'

interface Props {
  element: PageElement
}

interface Emits {
  update: [id: string, props: Partial<PageElement>]
  close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localContent = ref(props.element.content || '')
const localForegroundColor = ref(props.element.foregroundColor || '#000000')
const localBackgroundColor = ref(props.element.backgroundColor || '#ffffff')
const localErrorCorrectionLevel = ref(props.element.errorCorrectionLevel || 'medium')
const qrImageUrl = ref(props.element.qrImageUrl || '')
const generating = ref(false)

async function generateQRCode() {
  generating.value = true
  try {
    const { qr_image_url } = await generateQR({
      text: localContent.value,
      foreground_color: localForegroundColor.value.replace('#', ''),
      background_color: localBackgroundColor.value.replace('#', ''),
    })
    qrImageUrl.value = qr_image_url
    emit('update', props.element.id, { qrImageUrl: qr_image_url })
  } catch (e) {
    console.error('Error generating QR:', e)
  } finally {
    generating.value = false
  }
}

function updateContent() {
  emit('update', props.element.id, { content: localContent.value })
  generateQRCode()
}

function updateForegroundColor() {
  emit('update', props.element.id, { foregroundColor: localForegroundColor.value })
  generateQRCode()
}

function updateBackgroundColor() {
  emit('update', props.element.id, { backgroundColor: localBackgroundColor.value })
  generateQRCode()
}

function updateErrorCorrectionLevel() {
  emit('update', props.element.id, { errorCorrectionLevel: localErrorCorrectionLevel.value })
  generateQRCode()
}

watch(
  () => props.element.content,
  (val) => {
    localContent.value = val || ''
  }
)

watch(
  () => props.element.foregroundColor,
  (val) => {
    localForegroundColor.value = val || '#000000'
  }
)

watch(
  () => props.element.backgroundColor,
  (val) => {
    localBackgroundColor.value = val || '#ffffff'
  }
)

watch(
  () => props.element.errorCorrectionLevel,
  (val) => {
    localErrorCorrectionLevel.value = val || 'medium'
  }
)

onMounted(() => {
  if (props.element.qrImageUrl) {
    qrImageUrl.value = props.element.qrImageUrl
  } else if (localContent.value) {
    generateQRCode()
  }
})
</script>