<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save, Eye, ArrowLeft, Plus, X } from 'lucide-vue-next'
import { useArticlesStore } from '../../stores/articles'

interface Props {
  id?: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

const isEditing = computed(() => !!props.id || !!route.params.id)
const articleId = computed(() => props.id || route.params.id as string)

const form = ref({
  title: '',
  content: '',
  excerpt: '',
  category: '',
  tags: [] as string[],
  status: 'draft' as 'draft' | 'published' | 'archived',
  featured: false
})

const newTag = ref('')
const isLoading = ref(false)

onMounted(() => {
  if (isEditing.value) {
    const article = articlesStore.getArticleById(articleId.value)
    if (article) {
      form.value = {
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        tags: [...article.tags],
        status: article.status,
        featured: article.featured
      }
    }
  }
})

const addTag = () => {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

const handleSave = async () => {
  isLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would save to the backend
  console.log('Saving article:', form.value)
  
  isLoading.value = false
  router.push('/admin/articles')
}

const handlePreview = () => {
  // In a real app, this would open a preview modal or new tab
  console.log('Preview article:', form.value)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="article-editor">
    <div class="editor-header">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <ArrowLeft :size="20" />
          Back
        </button>
        <h1 class="page-title">
          {{ isEditing ? 'Edit Article' : 'New Article' }}
        </h1>
      </div>

      <div class="header-actions">
        <button @click="handlePreview" class="btn btn-secondary">
          <Eye :size="20" />
          Preview
        </button>
        <button 
          @click="handleSave" 
          :disabled="isLoading"
          class="btn btn-primary"
        >
          <Save :size="20" />
          {{ isLoading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <div class="editor-content">
      <div class="editor-main">
        <!-- Title -->
        <div class="form-group">
          <label class="form-label">Title</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter article title..."
            class="form-input title-input"
          />
        </div>

        <!-- Excerpt -->
        <div class="form-group">
          <label class="form-label">Excerpt</label>
          <textarea
            v-model="form.excerpt"
            placeholder="Brief description of the article..."
            class="form-textarea excerpt-input"
            rows="3"
          ></textarea>
        </div>

        <!-- Content -->
        <div class="form-group">
          <label class="form-label">Content</label>
          <textarea
            v-model="form.content"
            placeholder="Write your article content here..."
            class="form-textarea content-input"
            rows="20"
          ></textarea>
        </div>
      </div>

      <div class="editor-sidebar">
        <!-- Status -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">Status</h3>
          <select v-model="form.status" class="form-select">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Category -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">Category</h3>
          <select v-model="form.category" class="form-select">
            <option value="">Select category</option>
            <option 
              v-for="category in articlesStore.categories" 
              :key="category.id"
              :value="category.slug"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Tags -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">Tags</h3>
          <div class="tags-input">
            <div class="tag-input-container">
              <input
                v-model="newTag"
                type="text"
                placeholder="Add tag..."
                class="tag-input"
                @keydown.enter.prevent="addTag"
              />
              <button @click="addTag" class="add-tag-btn">
                <Plus :size="16" />
              </button>
            </div>
            
            <div v-if="form.tags.length" class="tags-list">
              <span 
                v-for="(tag, index) in form.tags" 
                :key="index"
                class="tag-item"
              >
                {{ tag }}
                <button @click="removeTag(index)" class="remove-tag">
                  <X :size="14" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Featured -->
        <div class="sidebar-section">
          <label class="checkbox-label">
            <input
              v-model="form.featured"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-text">Featured Article</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-editor {
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;

      .back-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        background: var(--bg-tertiary);
        color: var(--text-secondary);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--bg-secondary);
          color: var(--primary-color);
        }
      }

      .page-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
      }
    }

    .header-actions {
      display: flex;
      gap: 1rem;

      @media (max-width: 768px) {
        justify-content: stretch;
      }
    }
  }
}

.editor-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.editor-main {
  .form-group {
    margin-bottom: 2rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .form-input,
  .form-textarea {
    width: 100%;
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

  .title-input {
    padding: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .excerpt-input {
    padding: 1rem;
    resize: vertical;
  }

  .content-input {
    padding: 1rem;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    resize: vertical;
  }
}

.editor-sidebar {
  @media (max-width: 1024px) {
    order: -1;
  }
}

.sidebar-section {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  .sidebar-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--bg-secondary);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
}

.tags-input {
  .tag-input-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .tag-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 0.875rem;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }

    .add-tag-btn {
      padding: 0.5rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: var(--primary-dark);
      }
    }
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: var(--primary-color);
    color: white;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;

    .remove-tag {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      opacity: 0.8;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;

  .checkbox-input {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: var(--primary-color);
  }

  .checkbox-text {
    font-weight: 500;
    color: var(--text-primary);
  }
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
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