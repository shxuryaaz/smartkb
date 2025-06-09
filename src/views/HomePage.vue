<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, TrendingUp, Clock, Star, Users, BookOpen } from 'lucide-vue-next'
import { useArticlesStore } from '../stores/articles'
import ArticleCard from '../components/articles/ArticleCard.vue'
import CategoryCard from '../components/categories/CategoryCard.vue'

const articlesStore = useArticlesStore()

onMounted(() => {
  // Initialize any data needed for the homepage
})
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            Find answers to your
            <span class="gradient-text">technical questions</span>
          </h1>
          <p class="hero-description">
            Comprehensive knowledge base with tutorials, guides, and best practices
            for modern web development.
          </p>
          <div class="hero-actions">
            <RouterLink to="/search" class="btn btn-primary">
              <Search :size="20" />
              Start Searching
            </RouterLink>
            <RouterLink to="/categories" class="btn btn-secondary">
              Browse Categories
            </RouterLink>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <BookOpen :size="24" />
            <div class="stat-content">
              <div class="stat-value">50+</div>
              <div class="stat-label">Articles</div>
            </div>
          </div>
          <div class="stat-item">
            <Users :size="24" />
            <div class="stat-content">
              <div class="stat-value">1.2k+</div>
              <div class="stat-label">Readers</div>
            </div>
          </div>
          <div class="stat-item">
            <Star :size="24" />
            <div class="stat-content">
              <div class="stat-value">4.9</div>
              <div class="stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <Star :size="24" />
            Featured Articles
          </h2>
          <p class="section-description">
            Hand-picked articles covering the latest trends and best practices
          </p>
        </div>
        <div class="articles-grid">
          <ArticleCard
            v-for="article in articlesStore.featuredArticles"
            :key="article.id"
            :article="article"
            featured
          />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <BookOpen :size="24" />
            Browse by Category
          </h2>
          <p class="section-description">
            Explore our organized collection of technical knowledge
          </p>
        </div>
        <div class="categories-grid">
          <CategoryCard
            v-for="category in articlesStore.categories"
            :key="category.id"
            :category="category"
          />
        </div>
      </div>
    </section>

    <!-- Recent & Popular -->
    <section class="content-section">
      <div class="container">
        <div class="content-columns">
          <!-- Recent Articles -->
          <div class="content-column">
            <div class="section-header">
              <h2 class="section-title">
                <Clock :size="24" />
                Recent Articles
              </h2>
            </div>
            <div class="articles-list">
              <ArticleCard
                v-for="article in articlesStore.recentArticles"
                :key="article.id"
                :article="article"
                compact
              />
            </div>
          </div>

          <!-- Popular Articles -->
          <div class="content-column">
            <div class="section-header">
              <h2 class="section-title">
                <TrendingUp :size="24" />
                Popular Articles
              </h2>
            </div>
            <div class="articles-list">
              <ArticleCard
                v-for="article in articlesStore.popularArticles"
                :key="article.id"
                :article="article"
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: 4rem 0 6rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  svg {
    color: var(--primary-color);
  }
}

.stat-content {
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.featured-section,
.categories-section,
.content-section {
  padding: 4rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;

  svg {
    color: var(--primary-color);
  }
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.content-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.content-column {
  .section-header {
    text-align: left;
    margin-bottom: 2rem;

    .section-title {
      justify-content: flex-start;
      font-size: 1.5rem;
    }
  }
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &.btn-primary {
    background: var(--primary-color);
    color: white;

    &:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }
  }

  &.btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--bg-tertiary);
      transform: translateY(-2px);
    }
  }
}

@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-item {
    padding: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>