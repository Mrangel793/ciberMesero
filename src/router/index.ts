import { createRouter, createWebHistory } from 'vue-router';
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants/routes';
import { authGuard, guestGuard, roleGuard } from '@/shared/guards/authGuard';
import { ROLES } from '@/shared/constants/roles';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTE_PATHS.HOME,
      name: ROUTE_NAMES.HOME,
      component: () => import('@/modules/home/pages/LandingView.vue'),
      meta: { title: 'CiberMesero - Inicio' }
    },
    {
      path: ROUTE_PATHS.LOGIN,
      name: ROUTE_NAMES.LOGIN,
      component: () => import('@/modules/auth/pages/LoginView.vue'),
      beforeEnter: guestGuard,
      meta: { title: 'Iniciar Sesión' }
    },
    {
      path: ROUTE_PATHS.REGISTER,
      name: ROUTE_NAMES.REGISTER,
      component: () => import('@/modules/auth/pages/RegisterView.vue'),
      beforeEnter: guestGuard,
      meta: { title: 'Registrarse' }
    },
    {
      path: ROUTE_PATHS.DASHBOARD,
      name: ROUTE_NAMES.DASHBOARD,
      component: () => import('@/modules/home/pages/LandingView.vue'), // Temporal
      beforeEnter: authGuard,
      meta: { title: 'Dashboard', requiresAuth: true }
    },
    {
      path: ROUTE_PATHS.ADMIN_DASHBOARD,
      name: ROUTE_NAMES.ADMIN_DASHBOARD,
      component: () => import('@/modules/home/pages/LandingView.vue'), // Temporal
      beforeEnter: roleGuard([ROLES.ADMIN]),
      meta: { title: 'Admin Dashboard', requiresAuth: true, roles: [ROLES.ADMIN] }
    },
    {
      path: ROUTE_PATHS.RESTAURANT_DASHBOARD,
      name: ROUTE_NAMES.RESTAURANT_DASHBOARD,
      component: () => import('@/modules/home/pages/LandingView.vue'), // Temporal
      beforeEnter: roleGuard([ROLES.RESTAURANT_OWNER]),
      meta: { title: 'Restaurant Dashboard', requiresAuth: true, roles: [ROLES.RESTAURANT_OWNER] }
    },
    {
      path: ROUTE_PATHS.CUSTOMER_DASHBOARD,
      name: ROUTE_NAMES.CUSTOMER_DASHBOARD,
      component: () => import('@/modules/home/pages/LandingView.vue'), // Temporal
      beforeEnter: roleGuard([ROLES.CUSTOMER]),
      meta: { title: 'Customer Dashboard', requiresAuth: true, roles: [ROLES.CUSTOMER] }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: ROUTE_NAMES.HOME }
    }
  ]
});

// Navigation guard global para actualizar el título de la página
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'CiberMesero';
});

export default router;
