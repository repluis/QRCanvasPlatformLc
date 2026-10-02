<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { qrService } from '@/services/qr'

interface Props {
  qrImageUrl: string
  pageUrl: string
}

defineProps<Props>()

const qrImageUrl = ref(props.qrImageUrl || '')
const pageUrl = ref(props.pageUrl || '')
const loading = ref(true)
const customText = ref('')
const qrSize = ref(250)
const foregroundColor = ref('#e91e63')
const backgroundColor = ref('#ffffff')

async function generateQR() {
  loading.value = true
  try {
    const text = customText.value || pageUrl.value
    const result = await qrService.generate({
      text,
      size: qrSize.value,
      foreground_color: foregroundColor.value,
      background_color: backgroundColor.value,
      error_correction_level: 'medium',
    })
    qrImageUrl.value = result.image_url
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : 'Error generating QR')
  } finally {
    loading.value = false
  }
}

function copyUrl() {
  navigator.clipboard.writeText(pageUrl.value)
  alert('Link copied to clipboard!')
}

onMounted(() => {
  loading.value = false
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-rose-900/20 dark:via-slate-900 dark:to-pink-900/20 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-rose-600 dark:text-rose-400">💕 Love Declaration</h1>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Create a beautiful QR code with your love message</p>
      </div>

      <!-- QR Code Display -->
      <div class="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
        <div class="flex flex-col items-center">
          <div class="mb-4 p-4 bg-white rounded-lg shadow-inner">
            <img
              :src="qrImageUrl"
              alt="Love QR Code"
              class="w-64 h-64 mx-auto"
            />
          </div>

          <div class="w-full space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom Message (optional)</label>
              <textarea
                v-model="customText"
                rows="3"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter a custom message for the QR code..."
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Size</label>
                <input
                  type="number"
                  v-model.number="qrSize"
                  min="100"
                  max="500"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Foreground</label>
                <div class="flex items-center gap-2">
                  <input
                    type="color"
                    v-model="foregroundColor"
                    class="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    v-model="foregroundColor"
                    class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Background</label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  v-model="backgroundColor"
                  class="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                />
                <input
                  type="text"
                  v-model="backgroundColor"
                  class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              :disabled="loading"
              class="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-rose-600 disabled:opacity-50"
              @click="generateQR"
            >
              {{ loading ? 'Generating...' : 'Generate QR' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Page URL -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">Page Link</h3>
        <div class="flex gap-2">
          <input
            type="text"
            :value="pageUrl"
            readonly
            class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          />
          <button
            class="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            @click="copyUrl"
          >
            Copy
          </button>
        </div>
        <p class="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          Scan the QR code or share this link with your loved one ❤️
        </p>
      </div>
    </div>
  </div>
</template>