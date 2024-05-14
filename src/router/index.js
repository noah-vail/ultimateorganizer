import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LogoutView from '@/views/auth/LogoutView.vue'
import ToDosView from '@/views/ToDosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/todos',
      name: 'todos',
      component: ToDosView
    },
    {
      path: '/details',
      name: 'details',
      component: AboutView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/test',
      component: () => import('@/views/TestNotebooks.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/logout']

  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !localStorage.getItem('User')) {
    to.path = '/home'
    next({
      path: '/login',
      query: { nextUrl: to.path }
    })
  } else {
    next()
  }
})

export default router
