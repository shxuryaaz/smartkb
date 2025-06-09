import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'

export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  views: number
  rating: number
  ratings: number
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  articleCount: number
}

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([
    {
      id: '1',
      title: 'Getting Started with Vue.js 3',
      content: `# Getting Started with Vue.js 3

Vue.js 3 is the latest version of the progressive JavaScript framework for building user interfaces. This guide will help you get started with the fundamentals.

## Installation

You can install Vue.js 3 using npm or yarn:

\`\`\`bash
npm install vue@next
# or
yarn add vue@next
\`\`\`

## Your First Component

Here's a simple Vue component:

\`\`\`vue
<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="updateMessage">Click me!</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue 3!')

const updateMessage = () => {
  message.value = 'You clicked the button!'
}
</script>
\`\`\`

This component demonstrates the new Composition API syntax with the script setup feature.`,
      excerpt: 'Learn the basics of Vue.js 3 and start building modern web applications with the latest features.',
      author: 'Sarah Johnson',
      category: 'frontend',
      tags: ['vue', 'javascript', 'tutorial'],
      publishedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      views: 1250,
      rating: 4.8,
      ratings: 45,
      status: 'published',
      featured: true
    },
    {
      id: '2',
      title: 'TypeScript Best Practices for Large Applications',
      content: `# TypeScript Best Practices for Large Applications

When building large-scale applications with TypeScript, following best practices is crucial for maintainability and team productivity.

## Strict Configuration

Always enable strict mode in your tsconfig.json:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

## Interface Design

Design interfaces that are easy to understand and extend:

\`\`\`typescript
interface User {
  readonly id: string
  name: string
  email: string
  roles: Role[]
  createdAt: Date
  updatedAt: Date
}
\`\`\`

## Generic Utilities

Create reusable generic types for common patterns:

\`\`\`typescript
type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
}

type Repository<T> = {
  findById(id: string): Promise<T | null>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}
\`\`\``,
      excerpt: 'Essential TypeScript patterns and practices for building maintainable large-scale applications.',
      author: 'Michael Chen',
      category: 'backend',
      tags: ['typescript', 'best-practices', 'architecture'],
      publishedAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      views: 890,
      rating: 4.6,
      ratings: 32,
      status: 'published',
      featured: true
    },
    {
      id: '3',
      title: 'Responsive Design with Modern CSS',
      content: `# Responsive Design with Modern CSS

Creating responsive layouts has become much easier with modern CSS features like Grid, Flexbox, and Container Queries.

## CSS Grid for Layouts

CSS Grid is perfect for creating complex, responsive layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
\`\`\`

## Flexbox for Components

Use Flexbox for component-level layouts:

\`\`\`css
.card {
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.card-header {
  flex: 0 0 auto;
}

.card-content {
  flex: 1;
}

.card-footer {
  flex: 0 0 auto;
}
\`\`\`

## Container Queries

The new container queries allow components to respond to their container size:

\`\`\`css
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
\`\`\``,
      excerpt: 'Master modern CSS techniques for creating responsive, flexible layouts that work across all devices.',
      author: 'Emily Rodriguez',
      category: 'design',
      tags: ['css', 'responsive', 'layout'],
      publishedAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      views: 1100,
      rating: 4.9,
      ratings: 67,
      status: 'published',
      featured: false
    },
    {
      id: '4',
      title: 'API Security Fundamentals',
      content: `# API Security Fundamentals

Securing your APIs is crucial for protecting user data and maintaining system integrity. Here are the essential security practices.

## Authentication & Authorization

Implement proper authentication and authorization:

\`\`\`javascript
// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.sendStatus(401)
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
\`\`\`

## Input Validation

Always validate and sanitize input data:

\`\`\`javascript
const { body, validationResult } = require('express-validator')

app.post('/users',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Process valid data
  }
)
\`\`\`

## Rate Limiting

Implement rate limiting to prevent abuse:

\`\`\`javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

app.use('/api/', limiter)
\`\`\``,
      excerpt: 'Essential security practices for protecting your APIs from common vulnerabilities and attacks.',
      author: 'David Kim',
      category: 'security',
      tags: ['api', 'security', 'authentication'],
      publishedAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      views: 750,
      rating: 4.7,
      ratings: 28,
      status: 'published',
      featured: false
    }
  ])

  const categories = ref<Category[]>([
    { id: '1', name: 'Frontend Development', slug: 'frontend', description: 'UI/UX, JavaScript frameworks, and client-side technologies', articleCount: 15 },
    { id: '2', name: 'Backend Development', slug: 'backend', description: 'Server-side technologies, databases, and APIs', articleCount: 12 },
    { id: '3', name: 'Design & UX', slug: 'design', description: 'User interface design, user experience, and visual design', articleCount: 8 },
    { id: '4', name: 'Security', slug: 'security', description: 'Application security, best practices, and vulnerability prevention', articleCount: 6 },
    { id: '5', name: 'DevOps', slug: 'devops', description: 'Deployment, CI/CD, monitoring, and infrastructure', articleCount: 10 }
  ])

  const searchQuery = ref('')
  const searchFilters = ref({
    category: '',
    tags: [] as string[],
    dateRange: ''
  })

  const fuse = computed(() => new Fuse(articles.value, {
    keys: ['title', 'content', 'tags', 'author'],
    threshold: 0.3,
    includeScore: true
  }))

  const featuredArticles = computed(() => 
    articles.value.filter(article => article.featured && article.status === 'published')
  )

  const recentArticles = computed(() => 
    articles.value
      .filter(article => article.status === 'published')
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 5)
  )

  const popularArticles = computed(() => 
    articles.value
      .filter(article => article.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  )

  const searchResults = computed(() => {
    if (!searchQuery.value.trim()) {
      return articles.value.filter(article => article.status === 'published')
    }

    const results = fuse.value.search(searchQuery.value)
    return results.map(result => result.item)
  })

  const getArticleById = (id: string) => {
    return articles.value.find(article => article.id === id)
  }

  const getArticlesByCategory = (categorySlug: string) => {
    return articles.value.filter(article => 
      article.category === categorySlug && article.status === 'published'
    )
  }

  const getCategoryBySlug = (slug: string) => {
    return categories.value.find(category => category.slug === slug)
  }

  const incrementViews = (articleId: string) => {
    const article = articles.value.find(a => a.id === articleId)
    if (article) {
      article.views++
    }
  }

  const rateArticle = (articleId: string, rating: number) => {
    const article = articles.value.find(a => a.id === articleId)
    if (article) {
      const totalRating = article.rating * article.ratings + rating
      article.ratings++
      article.rating = totalRating / article.ratings
    }
  }

  return {
    articles,
    categories,
    searchQuery,
    searchFilters,
    featuredArticles,
    recentArticles,
    popularArticles,
    searchResults,
    getArticleById,
    getArticlesByCategory,
    getCategoryBySlug,
    incrementViews,
    rateArticle
  }
})