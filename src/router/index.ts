import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layouts/MainLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../views/HomePage.vue')
        },
        {
          path: '/search',
          name: 'Search',
          component: () => import('../views/SearchPage.vue')
        },
        {
          path: '/article/:id',
          name: 'Article',
          component: () => import('../views/ArticlePage.vue'),
          props: true
        },
        {
          path: '/category/:slug',
          name: 'Category',
          component: () => import('../views/CategoryPage.vue'),
          props: true
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../views/LoginPage.vue')
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('../views/ProfilePage.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresRole: ['admin', 'creator'] },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('../views/admin/DashboardPage.vue')
        },
        {
          path: 'articles',
          name: 'AdminArticles',
          component: () => import('../views/admin/ArticlesPage.vue')
        },
        {
          path: 'articles/new',
          name: 'AdminNewArticle',
          component: () => import('../views/admin/ArticleEditor.vue')
        },
        {
          path: 'articles/:id/edit',
          name: 'AdminEditArticle',
          component: () => import('../views/admin/ArticleEditor.vue'),
          props: true
        },
        {
          path: 'categories',
          name: 'AdminCategories',
          component: () => import('../views/admin/CategoriesPage.vue')
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('../views/admin/UsersPage.vue'),
          meta: { requiresRole: ['admin'] }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  if (to.meta.requiresRole && !authStore.hasRole(to.meta.requiresRole as string[])) {
    next('/')
    return
  }
  
  next()
})

export default router