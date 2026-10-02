<script setup lang="ts">
interface Props {
  element: any
}

defineProps<Props>()

defineEmits<{
  update: [id: string, props: any]
}>()

const fonts = [
  'Instrument Sans',
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Playfair Display',
  'Merriweather',
  'Georgia',
  'Times New Roman',
]
</script>

<template>
  <div class="w-72 border-l bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
    <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Text Properties</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
        <textarea
          v-model="element.content"
          rows="3"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          @input="emit('update', element.id, { content: element.content })"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Font Family</label>
        <select
          v-model="element.fontFamily"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          @change="emit('update', element.id, { fontFamily: element.fontFamily })"
        >
          <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Font Size</label>
          <input
            type="number"
            v-model.number="element.fontSize"
            min="8"
            max="120"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            @change="emit('update', element.id, { fontSize: element.fontSize })"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Font Weight</label>
          <select
            v-model="element.fontWeight"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            @change="emit('update', element.id, { fontWeight: element.fontWeight })"
          >
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Color</label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            v-model="element.color"
            class="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
            @change="emit('update', element.id, { color: element.color })"
          />
          <input
            type="text"
            v-model="element.color"
            class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            @change="emit('update', element.id, { color: element.color })"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alignment</label>
        <div class="flex gap-1">
          <button
            v-for="align in ['left', 'center', 'right']"
            :key="align"
            :class="[
              'flex-1 p-2 rounded-lg border text-sm transition',
              element.textAlign === align
                ? 'bg-rose-500 border-rose-500 text-white'
                : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700',
            ]"
            @click="emit('update', element.id, { textAlign: align })"
          >
            <svg class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="align === 'left'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 6h18M3 18h18" />
              <path v-if="align === 'center'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 6h18M3 18h18" />
              <path v-if="align === 'right'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
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
    </div>
  </div>
</template>