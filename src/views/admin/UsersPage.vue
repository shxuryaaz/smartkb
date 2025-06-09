<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search, Edit, Trash2, Shield, Mail, User } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedRole = ref('')

const mockUsers = ref([
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Content Creator',
    email: 'creator@example.com',
    role: 'creator',
    status: 'active',
    lastLogin: new Date('2024-01-14'),
    createdAt: new Date('2024-01-05')
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    lastLogin: new Date('2024-01-13'),
    createdAt: new Date('2024-01-10')
  }
])

const showModal = ref(false)
const editingUser = ref<any>(null)
const form = ref({
  name: '',
  email: '',
  role: 'user',
  status: 'active'
})

const filteredUsers = ref(mockUsers.value)

const openModal = (user?: any) => {
  if (user) {
    editingUser.value = user
    form.value = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  } else {
    editingUser.value = null
    form.value = {
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

const handleSave = () => {
  console.log('Saving user:', form.value)
  closeModal()
}

const handleDelete = (userId: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    console.log('Deleting user:', userId)
  }
}

const getRoleColor = (role: string) => {
  const colors = {
    admin: 'var(--error-color)',
    creator: 'var(--accent-color)',
    user: 'var(--primary-color)'
  }
  return colors[role as keyof typeof colors] || 'var(--text-secondary)'
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'var(--success-color)',
    inactive: 'var(--warning-color)',
    suspended: 'var(--error-color)'
  }
  return colors[status as keyof typeof colors] || 'var(--text-secondary)'
}
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage user accounts and permissions</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <Plus :size="20" />
        New User
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-container">
        <Search :size="20" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          class="search-input"
        />
      </div>

      <div class="filter-controls">
        <select v-model="selectedRole" class="filter-select">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="creator">Creator</option>
          <option value="user">User</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="users-table">
      <div class="table-header">
        <div class="header-cell user">User</div>
        <div class="header-cell role">Role</div>
        <div class="header-cell status">Status</div>
        <div class="header-cell last-login">Last Login</div>
        <div class="header-cell created">Created</div>
        <div class="header-cell actions">Actions</div>
      </div>

      <div class="table-body">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id"
          class="table-row"
        >
          <div class="table-cell user">
            <div class="user-info">
              <div class="user-avatar">
                <User :size="20" />
              </div>
              <div class="user-details">
                <h3 class="user-name">{{ user.name }}</h3>
                <p class="user-email">{{ user.email }}</p>
              </div>
            </div>
          </div>
          
          <div class="table-cell role">
            <span 
              class="role-badge" 
              :style="{ color: getRoleColor(user.role) }"
            >
              <Shield :size="14" />
              {{ user.role }}
            </span>
          </div>
          
          <div class="table-cell status">
            <span 
              class="status-badge" 
              :style="{ color: getStatusColor(user.status) }"
            >
              {{ user.status }}
            </span>
          </div>
          
          <div class="table-cell last-login">
            {{ user.lastLogin.toLocaleDateString() }}
          </div>
          
          <div class="table-cell created">
            {{ user.createdAt.toLocaleDateString() }}
          </div>
          
          <div class="table-cell actions">
            <div class="action-buttons">
              <button 
                @click="openModal(user)" 
                class="action-btn edit"
                title="Edit User"
              >
                <Edit :size="16" />
              </button>
              
              <button 
                @click="handleDelete(user.id)" 
                class="action-btn delete"
                title="Delete User"
              
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ editingUser ? 'Edit User' : 'New User' }}
          </h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <form @submit.prevent="handleSave" class="modal-form">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="User name"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="user@example.com"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Role</label>
            <select v-model="form.role" class="form-select">
              <option value="user">User</option>
              <option value="creator">Creator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="form.status" class="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingUser ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.users-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .header-content {
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      .page-subtitle {
        color: var(--text-secondary);
      }
    }
  }
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.search-container {
  position: relative;
  flex: 1;

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--bg-tertiary);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    &::placeholder {
      color: var(--text-tertiary);
    }
  }
}

.filter-controls {
  .filter-select {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    min-width: 150px;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
}

.users-table {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 1024px) {
    display: none;
  }
}

.header-cell {
  padding: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-body {
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.2s ease;

    &:hover {
      background: var(--bg-secondary);
    }

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 1024px) {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
    }
  }
}

.table-cell {
  padding: 1rem;
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.875rem;

  @media (max-width: 1024px) {
    padding: 0;
  }

  &.user {
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      .user-avatar {
        width: 2.5rem;
        height: 2.5rem;
        background: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .user-details {
        .user-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .user-email {
          color: var(--text-tertiary);
          font-size: 0.75rem;
        }
      }
    }
  }
}

.role-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge {
  font-weight: 600;
  text-transform: capitalize;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &.edit:hover {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }

  &.delete:hover {
    background: var(--error-color);
    color: white;
    border-color: var(--error-color);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal {
  background: var(--bg-primary);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;

    &:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }
  }
}

.modal-form {
  padding: 1.5rem;

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

  .form-input,
  .form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    &::placeholder {
      color: var(--text-tertiary);
    }
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &.btn-primary {
    background: var(--primary-color);
    color: white;

    &:hover {
      background: var(--primary-dark);
    }
  }

  &.btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--bg-secondary);
    }
  }
}
</style>