<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { Search, X, Clock, TrendingUp } from 'lucide-vue-next'
import { useArticlesStore } from '../../stores/articles'
import { useRouter } from 'vue-router'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const articlesStore = useArticlesStore()

const searchInput = ref<HTMLInputElement>()
const query = ref('')
const isLoading = ref(false)

const recentSearches = ref(['Vue.js', 'TypeScript', 'API Security'])
const trendingSearches = ref(['React vs Vue', 'Node.js', 'CSS Grid'])

const searchResults = computed(() => {
  if (!query.value.trim()) return []
  
  return articlesStore.searchResults.slice(0, 5)
})

const hasResults = computed(() => searchResults.value.length > 0)

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    query.value = ''
  }
})

watch(query, () => {
  articlesStore.searchQuery = query.value
})

const handleSearch = () => {
  if (query.value.trim()) {
    router.push({ name: 'Search', query: { q: query.value } })
    emit('close')
  }
}

const selectArticle = (articleId: string) => {
  router.push({ name: 'Article', params: { id: articleId } })
  emit('close')
}

const selectSuggestion = (suggestion: string) => {
  query.value = suggestion
  handleSearch()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  } else if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="search-modal-overlay" @click="emit('close')">
      <div class="search-modal" @click.stop>
        <div class="search-header">
          <div class="search-input-container">
            <Search :size="20" class="search-icon" />
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="Search articles, tutorials, and guides..."
              class="search-input"
              @keydown="handleKeydown"
            />
            <button @click="emit('close')" class="close-btn">
              <X :size="20" />
            </button>
          </div>
        </div>

        <div class="search-content">
          <!-- Search Results -->
          <div v-if="query && hasResults" class="search-results">
            <h3 class="section-title">Results</h3>
            <div class="results-list">
              <button
                v-for="article in searchResults"
                :key="article.id"
                @click="selectArticle(article.id)"
                class="result-item"
              >
                <div class="result-content">
                  <h4 class="result-title">{{ article.title }}</h4>
                  <p class="result-excerpt">{{ article.excerpt }}</p>
                  <div class="result-meta">
                    <span class="result-category">{{ article.category }}</span>
                    <span class="result-views">{{ article.views }} views</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- No Results -->
          <div v-else-if="query && !hasResults && !isLoading" class="no-results">
            <h3 class="section-title">No results found</h3>
            <p>Try adjusting your search terms or browse categories.</p>
          </div>

          <!-- Recent Searches -->
          <div v-if="!query" class="suggestions-section">
            <h3 class="section-title">
              <Clock :size="16" />
              Recent Searches
            </h3>
            <div class="suggestions-list">
              <button
                v-for="search in recentSearches"
                :key="search"
                @click="selectSuggestion(search)"
                class="suggestion-item"
              >
                {{ search }}
              </button>
            </div>
          </div>

          <!-- Trending Searches -->
          <div v-if="!query" class="suggestions-section">
            <h3 class="section-title">
              <TrendingUp :size="16" />
              Trending
            </h3>
            <div class="suggestions-list">
              <button
                v-for="search in trendingSearches"
                :key="search"
                @click="selectSuggestion(search)"
                class="suggestion-item"
              >
                {{ search }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 1rem;
}

.search-modal {
  background: var(--bg-primary);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-tertiary);
  z-index: 1;
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

.close-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
  }
}

.search-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 1rem;
  border: none;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    transform: translateY(-1px);
  }
}

.result-content {
  .result-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .result-excerpt {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  .result-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }
}

.suggestions-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-item {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.no-results {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem 0;

  h3 {
    margin-bottom: 0.5rem;
  }
}
</style>