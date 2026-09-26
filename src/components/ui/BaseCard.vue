<template>
  <div :class="['rounded-xl border bg-surface shadow-sm', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
})
</script>