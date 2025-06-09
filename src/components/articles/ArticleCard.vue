<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Calendar, User, Eye, Star, Clock } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'
import type { Article } from '../../stores/articles'

interface Props {
  article: Article
  featured?: boolean
  compact?: boolean
}

const props = defineProps<Props>()

const formattedDate = computed(() => 
  formatDistanceToNow(props.article.publishedAt, { addSuffix: true })
)

const categoryColor = computed(() => {
  const colors: Record<string, string> = {
    'frontend': 'var(--primary-color)',
    'backend': 'var(--accent-color)',
    'design': 'var(--success-color)',
    'security': 'var(--warning-color)',
    'devops': 'var(--error-color)'
  }
  return colors[props.article.category] || 'var(--text-secondary)'
})
</script>

<template>
  <article 
    class="article-card" 
    :class="{ 
      'article-card--featured': featured, 
      'article-card--compact': compact 
    }"
  >
    <div class="article-content">
      <div class="article-header">
        <div class="article-category" :style="{ color: categoryColor }">
          {{ article.category }}
        </div>
        <div v-if="featured" class="featured-badge">
          <Star :size="14" />
          Featured
        </div>
      </div>

      <h3 class="article-title">
        <RouterLink :to="`/article/${article.id}`">
          {{ article.title }}
        </RouterLink>
      </h3>

      <p class="article-excerpt">{{ article.excerpt }}</p>

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
          <span>{{ article.views }}</span>
        </div>
        <div class="meta-item">
          <Star :size="16" />
          <span>{{ article.rating.toFixed(1) }}</span>
        </div>
      </div>

      <div v-if="article.tags.length" class="article-tags">
        <span 
          v-for="tag in article.tags.slice(0, 3)" 
          :key="tag" 
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="article-footer">
      <RouterLink 
        :to="`/article/${article.id}`" 
        class="read-more-btn"
      >
        <Clock :size="16" />
        Read Article
      </RouterLink>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.article-card {
  background: var(--bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: var(--primary-color);
  }

  &--featured {
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    border: 2px solid var(--primary-color);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);

    .article-title a {
      color: var(--primary-color);
    }
  }

  &--compact {
    .article-content {
      padding: 1rem;
    }

    .article-title {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .article-excerpt {
      display: none;
    }

    .article-meta {
      gap: 1rem;
    }

    .article-footer {
      padding: 0 1rem 1rem;
    }
  }
}

.article-content {
  padding: 1.5rem;
  flex: 1;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.article-category {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.featured-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;

  svg {
    fill: currentColor;
  }
}

.article-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;

  a {
    color: var(--text-primary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
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
  padding: 0.25rem 0.75rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.article-footer {
  padding: 0 1.5rem 1.5rem;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
    transform: translateX(2px);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }
}

@media (max-width: 768px) {
  .article-meta {
    gap: 1rem;
  }

  .meta-item {
    font-size: 0.8rem;
  }
}
</style>