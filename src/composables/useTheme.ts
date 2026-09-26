import { ref, onMounted, watch } from 'vue'

const isDark = ref(true)

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  })

  watch(isDark, (value) => {
    localStorage.setItem('theme', value ? 'dark' : 'light')
    applyTheme()
  })

  return {
    isDark,
    toggleTheme,
  }
}