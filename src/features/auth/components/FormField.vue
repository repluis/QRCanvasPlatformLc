<script setup lang="ts">
defineProps<{
  id: string
  label: string
  type?: string
  autocomplete?: string
  placeholder?: string
  error?: string
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium text-text-muted">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type ?? 'text'"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      required
      class="w-full rounded-lg border bg-bg px-4 py-2.5 text-sm text-text outline-none transition focus:ring-2 focus:ring-primary"
      :class="error ? 'border-danger' : 'border-border'"
    />
    <p v-if="error" :id="`${id}-error`" class="mt-1 text-xs text-danger">{{ error }}</p>
  </div>
</template>
