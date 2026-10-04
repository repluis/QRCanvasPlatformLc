<script setup lang="ts">
import { computed, ref } from 'vue'
import { IMAGE_CATEGORIES } from '../../constants/imageLibrary'

const emit = defineEmits<{ addImage: [url: string] }>()

const category = ref(Object.keys(IMAGE_CATEGORIES)[0])
const items = computed(() => IMAGE_CATEGORIES[category.value]?.items ?? [])
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap gap-1">
      <button
        v-for="(cat, key) in IMAGE_CATEGORIES"
        :key="key"
        type="button"
        class="rounded px-2 py-1 text-xs font-medium transition"
        :class="category === key ? 'bg-rose-100 text-rose-700' : 'text-gray-500 hover:bg-gray-100'"
        @click="category = key"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="overflow-hidden rounded-lg border-2 border-transparent transition hover:border-rose-400 active:scale-95"
        :title="`Agregar ${item.label}`"
        @click="emit('addImage', item.url)"
      >
        <img :src="item.url" :alt="item.label" class="h-24 w-full object-cover" />
      </button>
    </div>
  </div>
</template>
