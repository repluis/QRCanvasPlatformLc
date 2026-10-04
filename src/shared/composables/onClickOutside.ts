import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function onClickOutside(target: Ref<HTMLElement | null>, handler: () => void) {
  function listener(e: PointerEvent) {
    if (target.value && !target.value.contains(e.target as Node)) handler()
  }
  onMounted(() => document.addEventListener('pointerdown', listener))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', listener))
}
