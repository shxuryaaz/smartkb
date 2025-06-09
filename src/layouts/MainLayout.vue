<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: var(--header-height);
}
</style>