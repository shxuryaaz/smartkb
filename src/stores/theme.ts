import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    updateDocumentClass()
  }

  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    localStorage.setItem('theme', theme)
    updateDocumentClass()
  }

  const initializeTheme = () => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      // Default to dark theme
      isDark.value = true
    }
    updateDocumentClass()
  }

  const updateDocumentClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    initializeTheme
  }
})