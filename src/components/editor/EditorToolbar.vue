<script setup lang="ts">
interface Props {
  hasSelection: boolean
  selectedType: string | null
  shapes: { type: string; name: string; icon: string }[]
}

defineProps<Props>()

defineEmits<{
  'add-text': []
  'add-image': []
  'add-shape': [type: string]
  'add-qr': []
  'add-navigation': []
  'remove': []
  'bring-forward': []
  'send-backward': []
}>()
</script>

<template>
  <div class="flex flex-1 items-center gap-2 overflow-x-auto px-4 pb-2">
    <div class="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-4">
      <button @click="$emit('add-text')" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition" title="Add Text">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16V5a3 3 0 00-3-3H6a3 3 0 00-3 3v7a3 3 0 003 3h2a3 3 0 003-3v-2a1 1 0 012 0v2a3 3 0 003 3h2a3 3 0 013-3v-2.5" />
        </svg>
      </button>
      <button @click="$emit('add-image')" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition" title="Add Image">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      <div class="relative">
        <button class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition" title="Add Shape" @click.stop="shapeMenuOpen = !shapeMenuOpen">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
        <div v-if="shapeMenuOpen" class="absolute bottom-full left-0 mb-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg py-1 min-w-[140px] z-10">
          <button v-for="shape in shapes" :key="shape.type" @click="$emit('add-shape', shape.type)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            <span class="text-xl">{{ shape.icon }}</span>
            {{ shape.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 px-4">
      <button @click="$emit('add-qr')" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition" title="Add QR Code">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      </button>
      <button @click="$emit('add-navigation')" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition" title="Add Navigation">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div v-if="hasSelection" class="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 px-4">
      <button v-if="selectedType !== 'qr'" @click="$emit('bring-forward')" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition" title="Bring Forward">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button v-if="selectedType !== 'qr'" @click="$emit('send-backward')" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition" title="Send Backward">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <button @click="$emit('remove')" class="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Delete">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>