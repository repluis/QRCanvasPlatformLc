import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/canvas',
    name: 'editor',
    component: () => import('@/views/pages/EditorView.vue'),
    meta: { requiresAuth: true, layout: 'editor' },
  },
  {
    path: '/page',
    name: 'page-show',
    component: () => import('@/views/pages/ShowView.vue'),
  },
  {
    path: '/qr/love',
    name: 'qr-love',
    component: () => import('@/views/qr/LoveDeclarationView.vue'),
  },
]