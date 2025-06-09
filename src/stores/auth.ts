import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'creator' | 'user'
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const hasRole = (roles: string[]) => {
    return user.value ? roles.includes(user.value.role) : false
  }

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock users for demo
    const mockUsers: Record<string, User> = {
      'admin@example.com': {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      },
      'creator@example.com': {
        id: '2',
        email: 'creator@example.com',
        name: 'Content Creator',
        role: 'creator'
      },
      'user@example.com': {
        id: '3',
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user'
      }
    }

    const mockUser = mockUsers[email]
    if (mockUser && password === 'password') {
      user.value = mockUser
      token.value = 'mock_jwt_token_' + Date.now()
      localStorage.setItem('auth_token', token.value)
      return { success: true }
    }
    
    throw new Error('Invalid credentials')
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const initialize = () => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      token.value = storedToken
      // In a real app, validate token and fetch user data
      user.value = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    hasRole,
    login,
    logout,
    initialize
  }
})