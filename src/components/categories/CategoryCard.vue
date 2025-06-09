<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { BookOpen, ArrowRight } from 'lucide-vue-next'
import type { Category } from '../../stores/articles'

interface Props {
  category: Category
}

const props = defineProps<Props>()

const getCategoryIcon = (slug: string) => {
  // Return appropriate icon based on category
  return BookOpen
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
  <RouterLink 
    :to="`/category/${category.slug}`" 
    class="category-card"
    :style="{ '--category-color': getCategoryColor(category.slug) }"
  >
    <div class="category-icon">
      <component :is="getCategoryIcon(category.slug)" :size="28" />
    </div>
    
    <div class="category-content">
      <h3 class="category-title">{{ category.name }}</h3>
      <p class="category-description">{{ category.description }}</p>
      
      <div class="category-stats">
        <span class="article-count">{{ category.articleCount }} articles</span>
      </div>
    </div>

    <div class="category-arrow">
      <ArrowRight :size="20" />
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
.category-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--category-color);
    transition: width 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: var(--category-color);

    &::before {
      width: 100%;
      opacity: 0.1;
    }

    .category-arrow {
      transform: translateX(4px);
    }

    .category-icon {
      transform: scale(1.1);
    }
  }
}

.category-icon {
  flex-shrink: 0;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--category-color), transparent);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--category-color);
  transition: transform 0.3s ease;
}

.category-content {
  flex: 1;
}

.category-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

.category-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.category-stats {
  .article-count {
    color: var(--category-color);
    font-weight: 600;
    font-size: 0.875rem;
  }
}

.category-arrow {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .category-card {
    gap: 1rem;
    padding: 1rem;
  }

  .category-icon {
    width: 3rem;
    height: 3rem;
  }

  .category-title {
    font-size: 1rem;
  }
}
</style>