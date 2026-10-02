<script setup lang="ts">
interface Props {
  element: any
  totalCards: number
}

defineProps<Props>()

defineEmits<{
  update: [id: string, props: any]
}>()
</script>

<template>
  <div class="w-72 border-l bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
    <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Navigation Properties</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Button Text</label>
        <input
          type="text"
          v-model="element.content"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          @input="emit('update', element.id, { content: element.content })"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Card</label>
        <select
          v-model.number="element.targetCanvasIndex"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          @change="emit('update', element.id, { targetCanvasIndex: element.targetCanvasIndex })"
        >
          <option v-for="i in totalCards" :key="i - 1" :value="i - 1">Card {{ i }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Background</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="element.fill"
              class="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
              @change="emit('update', element.id, { fill: element.fill })"
            />
            <input
              type="text"
              v-model="element.fill"
              class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              @change="emit('update', element.id, { fill: element.fill })"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Text Color</label>
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
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Border Radius</label>
        <input
          type="number"
          v-model.number="element.borderRadius"
          min="0"
          max="50"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          @change="emit('update', element.id, { borderRadius: element.borderRadius })"
        />
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