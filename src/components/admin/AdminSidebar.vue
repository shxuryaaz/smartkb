<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  Settings,
  BarChart3
} from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const navigation = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Articles', to: '/admin/articles', icon: FileText },
  { name: 'Categories', to: '/admin/categories', icon: FolderOpen },
  { name: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { name: 'Users', to: '/admin/users', icon: Users, adminOnly: true },
  { name: 'Settings', to: '/admin/settings', icon: Settings, adminOnly: true }
]

const filteredNavigation = navigation.filter(item => 
  !item.adminOnly || authStore.hasRole(['admin'])
)
</script>

<template>
  <aside class="admin-sidebar">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="item in filteredNavigation" :key="item.name">
          <RouterLink 
            :to="item.to" 
            :exact="item.exact"
            class="nav-link"
          >
            <component :is="item.icon" :size="20" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.admin-sidebar {
  width: 250px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  height: 100vh;
  position: fixed;
  left: 0;
  top: var(--header-height);
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
}

.sidebar-nav {
  padding: 1.5rem 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  border-right: 3px solid transparent;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary-color);
  }

  &.router-link-active {
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary-color);
    border-right-color: var(--primary-color);
  }

  svg {
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
  }
}
</style>