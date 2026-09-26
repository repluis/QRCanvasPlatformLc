<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variantClasses,
      sizeClasses,
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  type: 'button',
})

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-primary text-white hover:bg-primary-hover',
    destructive: 'bg-danger text-white hover:bg-red-600',
    outline: 'border border-border bg-transparent hover:bg-surface-alt text-text',
    secondary: 'bg-surface-alt text-text hover:bg-border-light',
    ghost: 'hover:bg-surface-alt text-text',
    link: 'text-primary underline-offset-4 hover:underline',
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-9 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-8 text-base',
    icon: 'h-10 w-10',
  }
  return sizes[props.size]
})
</script>