<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="brand-icon">SK</div>
          <h1 class="login-title">Welcome Back</h1>
          <p class="login-subtitle">Sign in to access your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <div class="input-container">
              <Mail :size="20" class="input-icon" />
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-container">
              <Lock :size="20" class="input-icon" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="form-input"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="password-toggle"
              >
                <Eye v-if="showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="login-btn"
          >
            <LogIn :size="20" />
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="demo-accounts">
          <h3>Demo Accounts</h3>
          <div class="demo-list">
            <div class="demo-account">
              <strong>Admin:</strong> admin@example.com / password
            </div>
            <div class="demo-account">
              <strong>Creator:</strong> creator@example.com / password
            </div>
            <div class="demo-account">
              <strong>User:</strong> user@example.com / password
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: 2rem 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;

  .brand-icon {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.25rem;
    margin: 0 auto 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .login-subtitle {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.login-form {
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

  .input-container {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    z-index: 1;
  }

  .form-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    &::placeholder {
      color: var(--text-tertiary);
    }
  }

  .password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: color 0.2s ease;

    &:hover {
      color: var(--text-primary);
    }
  }
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.demo-accounts {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);

  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    text-align: center;
  }

  .demo-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .demo-account {
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 0.5rem;
    border-radius: 0.5rem;

    strong {
      color: var(--text-primary);
    }
  }
}
</style>