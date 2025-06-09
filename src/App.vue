<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useThemeStore } from './stores/theme'
import { onMounted } from 'vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<template>
  <div id="app" :class="{ 'dark': themeStore.isDark }">
    <RouterView />
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  transition: all 0.3s ease;
}
</style>