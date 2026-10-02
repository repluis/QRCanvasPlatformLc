<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  class?: string
  padded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padded: true,
})

const cardClasses = computed(() => [
  'rounded-2xl border shadow-sm transition hover:shadow-md',
  'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  props.padded ? 'p-6' : '',
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>