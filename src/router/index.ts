import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/authStore'
import { onUnauthorized } from '@/shared/lib/http'

declare module 'vue-router' {
  interface RouteMeta {
    /** Requires a signed-in user */
    auth?: boolean
    /** Only for signed-out users (login, register) */
    guest?: boolean
    /** Wrap the view in the header/footer layout */
    layout?: 'main'
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/features/auth/views/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/features/pages/views/HomeView.vue'),
    meta: { auth: true, layout: 'main' },
  },
  {
    path: '/canvas',
    name: 'editor',
    component: () => import('@/features/pages/views/EditorView.vue'),
    meta: { auth: true },
  },
  {
    // Public page; this is the URL encoded in the QR codes
    path: '/page',
    name: 'page-show',
    component: () => import('@/features/pages/views/ShowView.vue'),
  },
  {
    path: '/qr/love',
    name: 'qr-love',
    component: () => import('@/features/qr/LoveDeclarationView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/shared/views/NotFoundView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.auth && !to.meta.guest) return true

  const auth = useAuthStore()
  await auth.ensureSession()

  if (to.meta.auth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'home' }
  }
  return true
})

// An expired session mid-use sends the user back to login
onUnauthorized(() => {
  const auth = useAuthStore()
  auth.clearSession()
  const current = router.currentRoute.value
  if (current.meta.auth) {
    router.replace({ name: 'login', query: { redirect: current.fullPath } })
  }
})
