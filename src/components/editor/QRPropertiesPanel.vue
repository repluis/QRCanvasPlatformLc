<script setup lang="ts">
interface Props {
  element: any
}

defineProps<Props>()

defineEmits<{
  update: [id: string, props: any]
}>()

const errorLevels = ['low', 'medium', 'quartile', 'high']
</script>

<template>
  <div class="w-72 border-l bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
    <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">QR Code Properties</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
        <textarea
          v-model="element.qrText"
          rows="3"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          @input="emit('update', element.id, { qrText: element.qrText })"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Foreground</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="element.qrForegroundColor"
              class="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
              @change="emit('update', element.id, { qrForegroundColor: element.qrForegroundColor })"
            />
            <input
              type="text"
              v-model="element.qrForegroundColor"
              class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              @change="emit('update', element.id, { qrForegroundColor: element.qrForegroundColor })"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Background</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="element.qrBackgroundColor"
              class="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
              @change="emit('update', element.id, { qrBackgroundColor: element.qrBackgroundColor })"
            />
            <input
              type="text"
              v-model="element.qrBackgroundColor"
              class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              @change="emit('update', element.id, { qrBackgroundColor: element.qrBackgroundColor })"
            />
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Error Correction</label>
        <select
          v-model="element.qrErrorCorrectionLevel"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          @change="emit('update', element.id, { qrErrorCorrectionLevel: element.qrErrorCorrectionLevel })"
        >
          <option v-for="level in errorLevels" :key="level" :value="level">{{ level.charAt(0).toUpperCase() + level.slice(1) }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <input
          type="range"
          v-model.number="element.opacity"
          min="0"
          max="1"
          step="0.1"
          class="flex-1"
          @input="emit('update', element.id, { opacity: element.opacity })"
        />
        <span class="text-sm text-slate-500 dark:text-slate-400 w-10">{{ Math.round(element.opacity * 100) }}%</span>
      </div>

      <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
        <p class="text-xs text-slate-500 dark:text-slate-400">Preview:</p>
        <img
          :src="element.qrImageUrl"
          alt="QR Preview"
          class="mt-2 w-32 h-32 mx-auto"
        />
      </div>
    </div>
  </div>
</template>