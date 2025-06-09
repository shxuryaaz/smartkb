<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminHeader from '../components/admin/AdminHeader.vue'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
</script>

<template>
  <div class="admin-layout">
    <AdminHeader />
    <div class="admin-body">
      <AdminSidebar />
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-body {
  flex: 1;
  display: flex;
  padding-top: var(--header-height);
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-body {
    flex-direction: column;
  }
  
  .admin-content {
    padding: 1rem;
  }
}
</style>