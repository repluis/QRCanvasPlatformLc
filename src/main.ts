import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import routes
import { routes } from './router/routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/qr/love']
  const authRequired = !publicPages.includes(to.path)
  const token = localStorage.getItem('token')

  if (authRequired && !token) {
    return next('/login')
  }

  if (token && (to.path === '/login' || to.path === '/register')) {
    return next('/')
  }

  next()
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')