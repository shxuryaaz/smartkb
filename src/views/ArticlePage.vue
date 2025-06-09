<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calendar, User, Eye, Star, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'
import { useArticlesStore } from '../stores/articles'
import ArticleCard from '../components/articles/ArticleCard.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

const userRating = ref(0)
const isBookmarked = ref(false)

const article = computed(() => 
  articlesStore.getArticleById(props.id || route.params.id as string)
)

const relatedArticles = computed(() => {
  if (!article.value) return []
  
  return articlesStore.articles
    .filter(a => 
      a.id !== article.value!.id && 
      a.status === 'published' &&
      (a.category === article.value!.category || 
       a.tags.some(tag => article.value!.tags.includes(tag)))
    )
    .slice(0, 3)
})

const formattedDate = computed(() => 
  article.value ? formatDistanceToNow(article.value.publishedAt, { addSuffix: true }) : ''
)

const categoryColor = computed(() => {
  if (!article.value) return 'var(--text-secondary)'
  
  const colors: Record<string, string> = {
    'frontend': 'var(--primary-color)',
    'backend': 'var(--accent-color)',
    'design': 'var(--success-color)',
    'security': 'var(--warning-color)',
    'devops': 'var(--error-color)'
  }
  return colors[article.value.category] || 'var(--text-secondary)'
})

onMounted(() => {
  if (article.value) {
    articlesStore.incrementViews(article.value.id)
  }
})

const goBack = () => {
  router.back()
}

const shareArticle = async () => {
  if (navigator.share && article.value) {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.excerpt,
        url: window.location.href
      })
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  } else {
    navigator.clipboard.writeText(window.location.href)
  }
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
}

const rateArticle = (rating: number) => {
  if (article.value) {
    userRating.value = rating
    articlesStore.rateArticle(article.value.id, rating)
  }
}
</script>

<template>
  <div v-if="article" class="article-page">
    <div class="container">
      <!-- Article Header -->
      <header class="article-header">
        <button @click="goBack" class="back-btn">
          <ArrowLeft :size="20" />
          Back
        </button>

        <div class="article-meta-header">
          <div class="category-badge" :style="{ color: categoryColor }">
            {{ article.category }}
          </div>
          
          <div class="article-actions">
            <button @click="shareArticle" class="action-btn">
              <Share2 :size="20" />
            </button>
            <button 
              @click="toggleBookmark" 
              class="action-btn"
              :class="{ active: isBookmarked }"
            >
              <Bookmark :size="20" />
            </button>
          </div>
        </div>

        <h1 class="article-title">{{ article.title }}</h1>
        
        <div class="article-meta">
          <div class="meta-item">
            <User :size="16" />
            <span>{{ article.author }}</span>
          </div>
          <div class="meta-item">
            <Calendar :size="16" />
            <span>{{ formattedDate }}</span>
          </div>
          <div class="meta-item">
            <Eye :size="16" />
            <span>{{ article.views }} views</span>
          </div>
          <div class="meta-item">
            <Star :size="16" />
            <span>{{ article.rating.toFixed(1) }} ({{ article.ratings }} ratings)</span>
          </div>
          <div class="meta-item">
            <Clock :size="16" />
            <span>5 min read</span>
          </div>
        </div>

        <div v-if="article.tags.length" class="article-tags">
          <span 
            v-for="tag in article.tags" 
            :key="tag" 
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- Article Content -->
      <main class="article-main">
        <div class="article-content">
          <div class="content-body" v-html="article.content.replace(/\n/g, '<br>')"></div>
        </div>

        <!-- Article Sidebar -->
        <aside class="article-sidebar">
          <!-- Table of Contents -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">Table of Contents</h3>
            <nav class="toc">
              <a href="#introduction" class="toc-link">Introduction</a>
              <a href="#installation" class="toc-link">Installation</a>
              <a href="#your-first-component" class="toc-link">Your First Component</a>
            </nav>
          </div>

          <!-- Rating -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">Rate this article</h3>
            <div class="rating-container">
              <div class="stars">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="rateArticle(star)"
                  class="star-btn"
                  :class="{ active: star <= userRating }"
                >
                  <Star :size="20" />
                </button>
              </div>
              <p v-if="userRating > 0" class="rating-text">
                You rated this {{ userRating }} star{{ userRating > 1 ? 's' : '' }}
              </p>
            </div>
          </div>
        </aside>
      </main>

      <!-- Related Articles -->
      <section v-if="relatedArticles.length" class="related-section">
        <h2 class="section-title">Related Articles</h2>
        <div class="related-grid">
          <ArticleCard
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            :article="relatedArticle"
            compact
          />
        </div>
      </section>
    </div>
  </div>

  <div v-else class="article-not-found">
    <div class="container">
      <h1>Article Not Found</h1>
      <p>The article you're looking for doesn't exist.</p>
      <RouterLink to="/" class="btn btn-primary">Go Home</RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.article-header {
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
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary-color);
  }
}

.article-meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.category-badge {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.article-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-tertiary);
  font-size: 0.875rem;

  svg {
    flex-shrink: 0;
  }
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.75rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
}

.article-main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.article-content {
  .content-body {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--text-primary);

    :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
      margin: 2rem 0 1rem;
      color: var(--text-primary);
    }

    :deep(p) {
      margin-bottom: 1.5rem;
    }

    :deep(code) {
      background: var(--bg-tertiary);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875em;
    }

    :deep(pre) {
      background: var(--bg-tertiary);
      padding: 1.5rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1.5rem 0;

      code {
        background: none;
        padding: 0;
      }
    }
  }
}

.article-sidebar {
  @media (max-width: 1024px) {
    order: -1;
  }
}

.sidebar-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.toc {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem 0;
  border-left: 2px solid transparent;
  padding-left: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-color);
    border-left-color: var(--primary-color);
  }
}

.rating-container {
  .stars {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .star-btn {
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover,
    &.active {
      color: var(--warning-color);
    }

    svg {
      fill: currentColor;
    }
  }

  .rating-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.related-section {
  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 2rem;
  }
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1 {
    margin-bottom: 1rem;
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