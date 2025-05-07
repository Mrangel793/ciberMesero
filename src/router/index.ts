import LandingView from '@/modules/home/pages/LandingView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/pages/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/modules/auth/pages/RegisterView.vue'),
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('@/modules/auth/pages/ForgotPassword.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/modules/home/pages/ContactView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/modules/usuario/pages/ChatView.vue'),
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/modules/usuario/pages/MenuView.vue'),
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
