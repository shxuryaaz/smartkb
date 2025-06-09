<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Bell, Settings, User, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <header class="admin-header">
    <div class="header-container">
      <div class="header-left">
        <RouterLink to="/admin" class="admin-brand">
          <div class="brand-icon">SK</div>
          <span class="brand-text">Admin Panel</span>
        </RouterLink>
      </div>

      <div class="header-right">
        <button class="header-btn">
          <Bell :size="20" />
        </button>
        
        <button class="header-btn">
          <Settings :size="20" />
        </button>

        <div class="user-menu">
          <button class="user-btn">
            <User :size="20" />
            <span>{{ authStore.user?.name }}</span>
          </button>
          
          <button @click="handleLogout" class="header-btn logout-btn">
            <LogOut :size="20" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.admin-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  --header-height: 4rem;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 1.5rem;
}

.header-left {
  .admin-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 600;

    .brand-icon {
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 0.875rem;
    }

    .brand-text {
      font-size: 1.125rem;
      font-weight: 700;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary-color);
  }

  &.logout-btn {
    color: var(--error-color);

    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}
</style>