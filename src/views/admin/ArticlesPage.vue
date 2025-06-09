<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-vue-next'
import { useArticlesStore } from '../../stores/articles'

const articlesStore = useArticlesStore()

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedCategory = ref('')

const filteredArticles = computed(() => {
  let articles = articlesStore.articles

  if (searchQuery.value) {
    articles = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedStatus.value) {
    articles = articles.filter(article => article.status === selectedStatus.value)
  }

  if (selectedCategory.value) {
    articles = articles.filter(article => article.category === selectedCategory.value)
  }

  return articles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
})

const getStatusColor = (status: string) => {
  const colors = {
    published: 'var(--success-color)',
    draft: 'var(--warning-color)',
    archived: 'var(--text-tertiary)'
  }
  return colors[status as keyof typeof colors] || 'var(--text-secondary)'
}
</script>

<template>
  <div class="articles-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Articles</h1>
        <p class="page-subtitle">Manage your knowledge base articles</p>
      </div>
      <RouterLink to="/admin/articles/new" class="btn btn-primary">
        <Plus :size="20" />
        New Article
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-container">
        <Search :size="20" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search articles..."
          class="search-input"
        />
      </div>

      <div class="filter-controls">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option 
            v-for="category in articlesStore.categories" 
            :key="category.id"
            :value="category.slug"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Articles Table -->
    <div class="articles-table">
      <div class="table-header">
        <div class="header-cell title">Title</div>
        <div class="header-cell author">Author</div>
        <div class="header-cell category">Category</div>
        <div class="header-cell status">Status</div>
        <div class="header-cell views">Views</div>
        <div class="header-cell date">Updated</div>
        <div class="header-cell actions">Actions</div>
      </div>

      <div class="table-body">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          class="table-row"
        >
          <div class="table-cell title">
            <div class="article-info">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
            </div>
          </div>
          
          <div class="table-cell author">
            {{ article.author }}
          </div>
          
          <div class="table-cell category">
            <span class="category-badge">{{ article.category }}</span>
          </div>
          
          <div class="table-cell status">
            <span 
              class="status-badge" 
              :style="{ color: getStatusColor(article.status) }"
            >
              {{ article.status }}
            </span>
          </div>
          
          <div class="table-cell views">
            {{ article.views.toLocaleString() }}
          </div>
          
          <div class="table-cell date">
            {{ article.updatedAt.toLocaleDateString() }}
          </div>
          
          <div class="table-cell actions">
            <div class="action-buttons">
              <RouterLink 
                :to="`/article/${article.id}`" 
                class="action-btn view"
                title="View Article"
              >
                <Eye :size="16" />
              </RouterLink>
              
              <RouterLink 
                :to="`/admin/articles/${article.id}/edit`" 
                class="action-btn edit"
                title="Edit Article"
              >
                <Edit :size="16" />
              </RouterLink>
              
              <button 
                class="action-btn delete"
                title="Delete Article"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredArticles.length === 0" class="no-articles">
      <h3>No articles found</h3>
      <p>Try adjusting your search or filters.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.articles-page {
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
  display: flex;
  gap: 1rem;

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

.articles-table {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr 1fr 1fr;
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
    grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr 1fr 1fr;
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

  &.title {
    .article-info {
      .article-title {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
        line-height: 1.3;
      }

      .article-excerpt {
        color: var(--text-tertiary);
        font-size: 0.75rem;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  &.author {
    font-weight: 500;
  }
}

.category-badge {
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
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
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &.view:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
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

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;

  &.btn-primary {
    background: var(--primary-color);
    color: white;

    &:hover {
      background: var(--primary-dark);
    }
  }
}

.no-articles {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);

  h3 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
}
</style>