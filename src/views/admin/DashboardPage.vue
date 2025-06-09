<script setup lang="ts">
import { computed } from 'vue'
import { BarChart3, Users, FileText, Eye, TrendingUp, Clock } from 'lucide-vue-next'
import { useArticlesStore } from '../../stores/articles'

const articlesStore = useArticlesStore()

const stats = computed(() => ({
  totalArticles: articlesStore.articles.length,
  publishedArticles: articlesStore.articles.filter(a => a.status === 'published').length,
  draftArticles: articlesStore.articles.filter(a => a.status === 'draft').length,
  totalViews: articlesStore.articles.reduce((sum, a) => sum + a.views, 0),
  totalCategories: articlesStore.categories.length
}))

const recentArticles = computed(() => 
  articlesStore.articles
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)
)

const topArticles = computed(() => 
  articlesStore.articles
    .filter(a => a.status === 'published')
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
)
</script>

<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Overview of your knowledge base</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <FileText :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalArticles }}</div>
          <div class="stat-label">Total Articles</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon published">
          <TrendingUp :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.publishedArticles }}</div>
          <div class="stat-label">Published</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon draft">
          <Clock :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.draftArticles }}</div>
          <div class="stat-label">Drafts</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon views">
          <Eye :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalViews.toLocaleString() }}</div>
          <div class="stat-label">Total Views</div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Recent Articles -->
      <div class="content-section">
        <h2 class="section-title">Recent Articles</h2>
        <div class="articles-list">
          <div 
            v-for="article in recentArticles" 
            :key="article.id"
            class="article-item"
          >
            <div class="article-info">
              <h3 class="article-title">{{ article.title }}</h3>
              <div class="article-meta">
                <span class="article-status" :class="article.status">
                  {{ article.status }}
                </span>
                <span class="article-date">
                  {{ article.updatedAt.toLocaleDateString() }}
                </span>
              </div>
            </div>
            <RouterLink 
              :to="`/admin/articles/${article.id}/edit`" 
              class="edit-btn"
            >
              Edit
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Top Articles -->
      <div class="content-section">
        <h2 class="section-title">Top Articles</h2>
        <div class="articles-list">
          <div 
            v-for="article in topArticles" 
            :key="article.id"
            class="article-item"
          >
            <div class="article-info">
              <h3 class="article-title">{{ article.title }}</h3>
              <div class="article-meta">
                <span class="article-views">
                  <Eye :size="14" />
                  {{ article.views }}
                </span>
                <span class="article-rating">
                  <BarChart3 :size="14" />
                  {{ article.rating.toFixed(1) }}
                </span>
              </div>
            </div>
            <RouterLink 
              :to="`/article/${article.id}`" 
              class="view-btn"
            >
              View
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <RouterLink to="/admin/articles/new" class="action-card">
          <FileText :size="32" />
          <h3>New Article</h3>
          <p>Create a new knowledge base article</p>
        </RouterLink>

        <RouterLink to="/admin/categories" class="action-card">
          <Users :size="32" />
          <h3>Manage Categories</h3>
          <p>Organize your content categories</p>
        </RouterLink>

        <RouterLink to="/admin/articles" class="action-card">
          <BarChart3 :size="32" />
          <h3>View All Articles</h3>
          <p>Manage your entire article library</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-page {
  .dashboard-header {
    margin-bottom: 2rem;

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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;

  .stat-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color);
    color: white;

    &.published {
      background: var(--success-color);
    }

    &.draft {
      background: var(--warning-color);
    }

    &.views {
      background: var(--accent-color);
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
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

.content-section {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);

  .article-info {
    flex: 1;

    .article-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .article-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: var(--text-secondary);

      .article-status {
        padding: 0.125rem 0.5rem;
        border-radius: 0.25rem;
        font-weight: 500;
        text-transform: capitalize;

        &.published {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success-color);
        }

        &.draft {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }
      }

      .article-views,
      .article-rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }
  }
}

.edit-btn,
.view-btn {
  padding: 0.375rem 0.75rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }
}

.quick-actions {
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.4;
  }
}
</style>