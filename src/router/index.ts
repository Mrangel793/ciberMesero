import LandingView from '@/modules/home/pages/LandingView.vue'
import { createRouter, createWebHistory } from 'vue-router'

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  BookOpenIcon,
  FolderIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

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
      name: 'Login',
      component: () => import('@/modules/auth/pages/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/modules/auth/pages/RegisterView.vue'),
    },

    // --- RUTAS PRIVADAS / MENÚ ---
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      component: () => import('@/modules/admin/pages/DashboardView.vue'),
      meta: {
        showInMenu: true,
        title: 'AdminDashboard',
        icon: 'HomeIcon',
        roles: ['admin'],
      }
    },
    {
      path: '/admin/orders',
      name: 'Pedidos',
      component: () => import('@/modules/admin/pages/OrdersView.vue'),
      meta: {
        showInMenu: true,
        title: 'Pedidos',
        icon: 'HomeIcon',
        roles: ['admin'],
      }
    },
    {
      path: '/admin/promotions',
      name: 'Promociones',
      component: () => import('@/modules/admin/pages/PromotionsView.vue'),
      meta: {
        showInMenu: true,
        title: 'Promociones',
        icon: 'HomeIcon',
        roles: ['admin'],
      }
    },
    {
      path: '/admin/menu',
      name: 'Menu',
      component: () => import('@/modules/admin/pages/MenuView.vue'),
      meta: {
        showInMenu: true,
        title: 'Menu',
        icon: 'HomeIcon',
        roles: ['admin'],
      }
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
