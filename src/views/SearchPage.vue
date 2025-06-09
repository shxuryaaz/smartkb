<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Filter, SortAsc, Grid, List } from 'lucide-vue-next'
import { useArticlesStore } from '../stores/articles'
import ArticleCard from '../components/articles/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTags = ref<string[]>([])
const sortBy = ref('relevance')
const viewMode = ref<'grid' | 'list'>('grid')
const showFilters = ref(false)

const searchResults = computed(() => {
  let results = articlesStore.searchResults
  
  // Filter by category
  if (selectedCategory.value) {
    results = results.filter(article => article.category === selectedCategory.value)
  }
  
  // Filter by tags
  if (selectedTags.value.length > 0) {
    results = results.filter(article => 
      selectedTags.value.some(tag => article.tags.includes(tag))
    )
  }
  
  // Sort results
  switch (sortBy.value) {
    case 'date':
      return results.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    case 'views':
      return results.sort((a, b) => b.views - a.views)
    case 'rating':
      return results.sort((a, b) => b.rating - a.rating)
    default:
      return results
  }
})

const availableTags = computed(() => {
  const tags = new Set<string>()
  articlesStore.articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const hasActiveFilters = computed(() => 
  selectedCategory.value || selectedTags.value.length > 0 || sortBy.value !== 'relevance'
)

onMounted(() => {
  const query = route.query.q as string
  if (query) {
    searchQuery.value = query
    articlesStore.searchQuery = query
  }
})

watch(searchQuery, (newQuery) => {
  articlesStore.searchQuery = newQuery
  router.replace({ query: { q: newQuery || undefined } })
})

const clearFilters = () => {
  selectedCategory.value = ''
  selectedTags.value = []
  sortBy.value = 'relevance'
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}
</script>

<template>
  <div class="search-page">
    <div class="container">
      <!-- Search Header -->
      <div class="search-header">
        <div class="search-input-container">
          <Search :size="20" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles, tutorials, and guides..."
            class="search-input"
          />
        </div>
        
        <div class="search-controls">
          <button 
            @click="showFilters = !showFilters"
            class="control-btn"
            :class="{ active: showFilters }"
          >
            <Filter :size="20" />
            Filters
          </button>
          
          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'"
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
            >
              <Grid :size="20" />
            </button>
            <button 
              @click="viewMode = 'list'"
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
            >
              <List :size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="filters-panel">
        <div class="filter-section">
          <h3 class="filter-title">Category</h3>
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

        <div class="filter-section">
          <h3 class="filter-title">Tags</h3>
          <div class="tags-container">
            <button
              v-for="tag in availableTags"
              :key="tag"
              @click="toggleTag(tag)"
              class="tag-filter"
              :class="{ active: selectedTags.includes(tag) }"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Sort By</h3>
          <select v-model="sortBy" class="filter-select">
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="views">Views</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div v-if="hasActiveFilters" class="filter-actions">
          <button @click="clearFilters" class="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div class="search-results">
        <div class="results-header">
          <h2 class="results-title">
            <span v-if="searchQuery">Search Results for "{{ searchQuery }}"</span>
            <span v-else>All Articles</span>
          </h2>
          <p class="results-count">{{ searchResults.length }} articles found</p>
        </div>

        <div 
          class="results-grid"
          :class="{ 'list-view': viewMode === 'list' }"
        >
          <ArticleCard
            v-for="article in searchResults"
            :key="article.id"
            :article="article"
            :compact="viewMode === 'list'"
          />
        </div>

        <div v-if="searchResults.length === 0" class="no-results">
          <h3>No articles found</h3>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-input-container {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  background: var(--bg-secondary);
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

.search-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.view-toggle {
  display: flex;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.view-btn {
  padding: 0.75rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &.active {
    background: var(--primary-color);
    color: white;
  }
}

.filters-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.filter-section {
  .filter-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }
}

.filter-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-filter {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.filter-actions {
  display: flex;
  align-items: end;
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: var(--error-color);
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
}

.search-results {
  .results-header {
    margin-bottom: 2rem;

    .results-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .results-count {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;

  &.list-view {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);

  h3 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
}
</style>