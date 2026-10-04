<script setup lang="ts">
import { ref } from 'vue'
import { GRADIENT_BACKGROUNDS, PASTEL_BACKGROUNDS, SOLID_BACKGROUNDS } from '../../constants/library'

const emit = defineEmits<{ setBackground: [value: string] }>()

const SUBTABS = [
  { id: 'solids', label: 'Sólidos' },
  { id: 'pastels', label: 'Pastel' },
  { id: 'gradients', label: 'Degradados' },
] as const

const subtab = ref<(typeof SUBTABS)[number]['id']>('solids')
const custom = ref('#ffffff')
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap gap-1">
      <button
        v-for="st in SUBTABS"
        :key="st.id"
        type="button"
        class="rounded px-2 py-1 text-xs font-medium transition"
        :class="subtab === st.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'"
        @click="subtab = st.id"
      >
        {{ st.label }}
      </button>
    </div>

    <div v-if="subtab === 'solids'" class="grid grid-cols-5 gap-1.5">
      <button
        type="button"
        class="transparent-swatch h-8 w-full rounded-lg border border-gray-300 transition hover:scale-110 active:scale-95"
        title="Transparente"
        @click="emit('setBackground', 'transparent')"
      />
      <button
        v-for="c in SOLID_BACKGROUNDS"
        :key="c"
        type="button"
        class="h-8 w-full rounded-lg border border-gray-200 transition hover:scale-110 active:scale-95"
        :style="{ backgroundColor: c }"
        :title="c"
        @click="emit('setBackground', c)"
      />
    </div>

    <div v-else-if="subtab === 'pastels'" class="grid grid-cols-5 gap-1.5">
      <button
        v-for="c in PASTEL_BACKGROUNDS"
        :key="c"
        type="button"
        class="h-8 w-full rounded-lg border border-gray-200 transition hover:scale-110 active:scale-95"
        :style="{ backgroundColor: c }"
        :title="c"
        @click="emit('setBackground', c)"
      />
    </div>

    <div v-else class="space-y-2">
      <button
        v-for="g in GRADIENT_BACKGROUNDS"
        :key="g.label"
        type="button"
        class="flex h-12 w-full items-center justify-center rounded-lg border border-gray-200 transition hover:scale-[1.02] active:scale-95"
        :style="{ background: g.value }"
        @click="emit('setBackground', g.value)"
      >
        <span class="text-xs font-medium drop-shadow-md" :class="g.darkText ? 'text-gray-700' : 'text-white'">{{ g.label }}</span>
      </button>
    </div>

    <label class="flex items-center gap-2 border-t pt-3 text-xs text-gray-500">
      Personalizado
      <input v-model="custom" type="color" class="h-8 flex-1 cursor-pointer rounded border border-gray-200" @change="emit('setBackground', custom)" />
    </label>
  </div>
</template>

<style scoped>
.transparent-swatch {
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
}
</style>
