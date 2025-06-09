<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FolderOpen, ArrowLeft } from 'lucide-vue-next'
import { useArticlesStore } from '../stores/articles'
import ArticleCard from '../components/articles/ArticleCard.vue'

interface Props {
  slug: string
}

const props = defineProps<Props>()
const route = useRoute()
const articlesStore = useArticlesStore()

const categorySlug = computed(() => props.slug || route.params.slug as string)

const category = computed(() => 
  articlesStore.getCategoryBySlug(categorySlug.value)
)

const articles = computed(() => 
  articlesStore.getArticlesByCategory(categorySlug.value)
)

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
  <div v-if="category" class="category-page">
    <div class="container">
      <!-- Category Header -->
      <header class="category-header">
        <RouterLink to="/" class="back-btn">
          <ArrowLeft :size="20" />
          Back to Home
        </RouterLink>

        <div class="category-info">
          <div 
            class="category-icon"
            :style="{ '--category-color': getCategoryColor(category.slug) }"
          >
            <FolderOpen :size="32" />
          </div>
          
          <div class="category-content">
            <h1 class="category-title">{{ category.name }}</h1>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-stats">
              <span class="article-count">{{ articles.length }} articles</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Articles Grid -->
      <section class="articles-section">
        <div v-if="articles.length" class="articles-grid">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <div v-else class="no-articles">
          <h3>No articles found</h3>
          <p>There are no published articles in this category yet.</p>
          <RouterLink to="/" class="btn btn-primary">Browse All Articles</RouterLink>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="category-not-found">
    <div class="container">
      <h1>Category Not Found</h1>
      <p>The category you're looking for doesn't exist.</p>
      <RouterLink to="/" class="btn btn-primary">Go Home</RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.category-header {
  margin-bottom: 3rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-bottom: 2rem;
  width: fit-content;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary-color);
  }
}

.category-info {
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
}

.category-icon {
  flex-shrink: 0;
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, var(--category-color), transparent);
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--category-color);
}

.category-content {
  flex: 1;
}

.category-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.category-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.category-stats {
  .article-count {
    color: var(--category-color);
    font-weight: 600;
    font-size: 1rem;
  }
}

.articles-section {
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

.no-articles,
.category-not-found {
  text-align: center;
  padding: 4rem 2rem;

  h1, h3 {
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-secondary);
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
</style>