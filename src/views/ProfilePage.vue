<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Shield, Settings, Bookmark, Clock, Star } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const activeTab = ref('profile')

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'bookmarks', name: 'Bookmarks', icon: Bookmark },
  { id: 'history', name: 'History', icon: Clock },
  { id: 'settings', name: 'Settings', icon: Settings }
]

const mockBookmarks = [
  { id: '1', title: 'Getting Started with Vue.js 3', category: 'frontend' },
  { id: '2', title: 'TypeScript Best Practices', category: 'backend' },
  { id: '3', title: 'API Security Fundamentals', category: 'security' }
]

const mockHistory = [
  { id: '1', title: 'Getting Started with Vue.js 3', visitedAt: new Date('2024-01-15') },
  { id: '2', title: 'Responsive Design with Modern CSS', visitedAt: new Date('2024-01-14') },
  { id: '4', title: 'API Security Fundamentals', visitedAt: new Date('2024-01-13') }
]
</script>

<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="profile-info">
          <div class="avatar">
            <User :size="32" />
          </div>
          <div class="user-details">
            <h1 class="user-name">{{ authStore.user?.name }}</h1>
            <p class="user-email">{{ authStore.user?.email }}</p>
            <div class="user-role">
              <Shield :size="16" />
              <span>{{ authStore.user?.role }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-content">
        <nav class="profile-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
          >
            <component :is="tab.icon" :size="20" />
            {{ tab.name }}
          </button>
        </nav>

        <div class="tab-content">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="tab-panel">
            <div class="profile-stats">
              <div class="stat-card">
                <div class="stat-icon">
                  <Bookmark :size="24" />
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ mockBookmarks.length }}</div>
                  <div class="stat-label">Bookmarks</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <Clock :size="24" />
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ mockHistory.length }}</div>
                  <div class="stat-label">Articles Read</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <Star :size="24" />
                </div>
                <div class="stat-info">
                  <div class="stat-value">4.8</div>
                  <div class="stat-label">Avg Rating</div>
                </div>
              </div>
            </div>

            <div class="profile-form">
              <h3>Profile Information</h3>
              <form class="form">
                <div class="form-group">
                  <label class="form-label">Name</label>
                  <input 
                    type="text" 
                    :value="authStore.user?.name" 
                    class="form-input"
                    readonly
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    :value="authStore.user?.email" 
                    class="form-input"
                    readonly
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Role</label>
                  <input 
                    type="text" 
                    :value="authStore.user?.role" 
                    class="form-input"
                    readonly
                  />
                </div>
              </form>
            </div>
          </div>

          <!-- Bookmarks Tab -->
          <div v-if="activeTab === 'bookmarks'" class="tab-panel">
            <h3>Bookmarked Articles</h3>
            <div class="bookmarks-list">
              <div 
                v-for="bookmark in mockBookmarks" 
                :key="bookmark.id"
                class="bookmark-item"
              >
                <div class="bookmark-content">
                  <h4 class="bookmark-title">{{ bookmark.title }}</h4>
                  <span class="bookmark-category">{{ bookmark.category }}</span>
                </div>
                <RouterLink 
                  :to="`/article/${bookmark.id}`" 
                  class="bookmark-link"
                >
                  Read
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- History Tab -->
          <div v-if="activeTab === 'history'" class="tab-panel">
            <h3>Reading History</h3>
            <div class="history-list">
              <div 
                v-for="item in mockHistory" 
                :key="item.id"
                class="history-item"
              >
                <div class="history-content">
                  <h4 class="history-title">{{ item.title }}</h4>
                  <span class="history-date">
                    {{ item.visitedAt.toLocaleDateString() }}
                  </span>
                </div>
                <RouterLink 
                  :to="`/article/${item.id}`" 
                  class="history-link"
                >
                  Read Again
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="tab-panel">
            <h3>Settings</h3>
            <div class="settings-section">
              <div class="setting-item">
                <div class="setting-info">
                  <h4>Theme</h4>
                  <p>Choose your preferred theme</p>
                </div>
                <button 
                  @click="themeStore.toggleTheme"
                  class="theme-toggle"
                >
                  {{ themeStore.isDark ? 'Dark' : 'Light' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.profile-header {
  margin-bottom: 3rem;
}

.profile-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.avatar {
  width: 5rem;
  height: 5rem;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-details {
  .user-name {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .user-email {
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
  }

  .user-role {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    font-weight: 600;
    text-transform: capitalize;
  }
}

.profile-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 2px solid transparent;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  &.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
    background: var(--bg-tertiary);
  }
}

.tab-content {
  padding: 2rem;
}

.tab-panel {
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);

  .stat-icon {
    color: var(--primary-color);
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.profile-form {
  .form {
    max-width: 500px;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 1rem;

    &[readonly] {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.bookmarks-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bookmark-item,
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.bookmark-content,
.history-content {
  flex: 1;

  h4 {
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .bookmark-category,
  .history-date {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.bookmark-link,
.history-link {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }
}

.settings-section {
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: var(--bg-tertiary);
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);

    .setting-info {
      h4 {
        color: var(--text-primary);
        margin-bottom: 0.25rem;
      }

      p {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
    }

    .theme-toggle {
      padding: 0.5rem 1rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s ease;

      &:hover {
        background: var(--primary-dark);
      }
    }
  }
}
</style>