<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-vue-next'
import { useArticlesStore } from '../../stores/articles'

const articlesStore = useArticlesStore()

const showModal = ref(false)
const editingCategory = ref<any>(null)
const form = ref({
  name: '',
  slug: '',
  description: ''
})

const openModal = (category?: any) => {
  if (category) {
    editingCategory.value = category
    form.value = {
      name: category.name,
      slug: category.slug,
      description: category.description
    }
  } else {
    editingCategory.value = null
    form.value = {
      name: '',
      slug: '',
      description: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCategory.value = null
  form.value = {
    name: '',
    slug: '',
    description: ''
  }
}

const handleSave = () => {
  // In a real app, this would save to the backend
  console.log('Saving category:', form.value)
  closeModal()
}

const handleDelete = (categoryId: string) => {
  if (confirm('Are you sure you want to delete this category?')) {
    // In a real app, this would delete from the backend
    console.log('Deleting category:', categoryId)
  }
}

const generateSlug = () => {
  form.value.slug = form.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const getCategoryColor = (slug: string) => {
  const colors: Record<string, string> = {
    'frontend': 'var(--primary-color)',
    'backend': 'var(--accent-color)',
    'design': 'var(--success-color)',
    'security': 'var(--warning-color)',
    'devops': 'var(--error-color)'
  }
  return colors[slug] || 'var(--text-secondary)'
}
</script>

<template>
  <div class="categories-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Categories</h1>
        <p class="page-subtitle">Organize your content into categories</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <Plus :size="20" />
        New Category
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="categories-grid">
      <div 
        v-for="category in articlesStore.categories" 
        :key="category.id"
        class="category-card"
        :style="{ '--category-color': getCategoryColor(category.slug) }"
      >
        <div class="category-icon">
          <FolderOpen :size="24" />
        </div>
        
        <div class="category-content">
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-description">{{ category.description }}</p>
          <div class="category-stats">
            <span class="article-count">{{ category.articleCount }} articles</span>
          </div>
        </div>

        <div class="category-actions">
          <button 
            @click="openModal(category)" 
            class="action-btn edit"
            title="Edit Category"
          >
            <Edit :size="16" />
          </button>
          <button 
            @click="handleDelete(category.id)" 
            class="action-btn delete"
            title="Delete Category"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ editingCategory ? 'Edit Category' : 'New Category' }}
          </h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <form @submit.prevent="handleSave" class="modal-form">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Category name"
              class="form-input"
              @input="generateSlug"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Slug</label>
            <input
              v-model="form.slug"
              type="text"
              placeholder="category-slug"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              v-model="form.description"
              placeholder="Category description"
              class="form-textarea"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingCategory ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.categories-page {
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  transition: all 0.2s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--category-color);
    border-radius: 1rem 0 0 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .category-icon {
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, var(--category-color), transparent);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--category-color);
  }

  .category-content {
    flex: 1;

    .category-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .category-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.4;
      margin-bottom: 0.75rem;
    }

    .category-stats {
      .article-count {
        color: var(--category-color);
        font-weight: 600;
        font-size: 0.875rem;
      }
    }
  }

  .category-actions {
    display: flex;
    gap: 0.5rem;
  }
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
  .form-textarea {
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

  .form-textarea {
    resize: vertical;
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