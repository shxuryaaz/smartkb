<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Search, User, Menu, X, Sun, Moon } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'
import SearchModal from '../search/SearchModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isMenuOpen = ref(false)
const isSearchOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const openSearch = () => {
  isSearchOpen.value = true
}

const closeSearch = () => {
  isSearchOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  isMenuOpen.value = false
}

const navigation = computed(() => [
  { name: 'Home', to: '/', exact: true },
  { name: 'Categories', to: '/categories' },
  { name: 'Recent', to: '/recent' },
  { name: 'Popular', to: '/popular' }
])
</script>

<template>
  <header class="app-header">
    <nav class="nav-container">
      <div class="nav-brand">
        <RouterLink to="/" class="brand-link">
          <div class="brand-icon">SK</div>
          <span class="brand-text">SmartKB</span>
        </RouterLink>
      </div>

      <div class="nav-center">
        <div class="nav-links desktop-only">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            :exact="item.exact"
            class="nav-link"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>

      <div class="nav-actions">
        <button @click="openSearch" class="action-btn search-btn">
          <Search :size="20" />
          <span class="sr-only">Search</span>
        </button>

        <button @click="themeStore.toggleTheme" class="action-btn theme-btn">
          <Sun v-if="themeStore.isDark" :size="20" />
          <Moon v-else :size="20" />
          <span class="sr-only">Toggle theme</span>
        </button>

        <div v-if="authStore.isAuthenticated" class="user-menu">
          <RouterLink to="/profile" class="action-btn user-btn">
            <User :size="20" />
            <span class="sr-only">Profile</span>
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.hasRole(['admin', 'creator'])" 
            to="/admin" 
            class="action-btn admin-btn"
          >
            Admin
          </RouterLink>
          
          <button @click="handleLogout" class="action-btn logout-btn">
            Logout
          </button>
        </div>

        <RouterLink v-else to="/login" class="action-btn login-btn">
          Login
        </RouterLink>

        <button @click="toggleMenu" class="action-btn mobile-menu-btn mobile-only">
          <Menu v-if="!isMenuOpen" :size="20" />
          <X v-else :size="20" />
          <span class="sr-only">Toggle menu</span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="mobile-menu mobile-only">
      <div class="mobile-nav-links">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          :exact="item.exact"
          class="mobile-nav-link"
          @click="isMenuOpen = false"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </div>

    <!-- Search Modal -->
    <SearchModal :is-open="isSearchOpen" @close="closeSearch" />
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(var(--bg-primary-rgb), 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  --header-height: 4rem;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 1rem;
}

.nav-brand {
  .brand-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-color);
    }
  }

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
    font-size: 1.25rem;
    font-weight: 700;
  }
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: var(--primary-color);
  }

  &.router-link-active {
    color: var(--primary-color);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-color);
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
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
  text-decoration: none;
  font-weight: 500;

  &:hover {
    background: var(--bg-secondary);
    color: var(--primary-color);
  }

  &.login-btn {
    background: var(--primary-color);
    color: white;
    padding: 0.5rem 1rem;

    &:hover {
      background: var(--primary-dark);
      color: white;
    }
  }

  &.admin-btn {
    background: var(--accent-color);
    color: white;
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;

    &:hover {
      opacity: 0.9;
      color: white;
    }
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-menu {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 1rem;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s ease;

  &:hover,
  &.router-link-active {
    color: var(--primary-color);
  }
}

.desktop-only {
  @media (max-width: 768px) {
    display: none;
  }
}

.mobile-only {
  @media (min-width: 769px) {
    display: none;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>