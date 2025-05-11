import AdminLayout from '@/layaouts/AdminLayout.vue';
import LandingView from '@/modules/home/pages/LandingView.vue'
import { useAuthStore } from '@/stores/auth';
import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
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
  {
    path: '/admin',
    component: AdminLayout, // Layout general para admin
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/modules/admin/pages/DashboardView.vue'),
        meta: { title: 'Inicio', icon:'HomeIcon', roles: ['admin', 'superadmin'], showInMenu: true }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/modules/admin/pages/OrdersView.vue'),
        meta: { title: 'Pedidos', icon: 'DocumentTextIcon', roles: ['admin'], showInMenu: true }
      },
      {
        path: 'promotions',
        name: 'AdminPromotions',
        component: () => import('@/modules/admin/pages/PromotionsView.vue'),
        meta: { title: 'Promociones', icon: 'TagIcon', roles: ['admin'], showInMenu: true }
      },
      {
        path: 'menu',
        name: 'AdminMenu',
        component: () => import('@/modules/admin/pages/MenuView.vue'),
        meta: { title: 'Menú', icon:'BookOpenIcon', roles: ['admin'], showInMenu: true }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/modules/admin/pages/CategoriesView.vue'),
        meta: { title: 'Categorías', icon: 'FolderOpenIcon', roles: ['admin'], showInMenu: true }
      },
      {
        path: 'team',
        name: 'AdminTeam',
        component: () => import('@/modules/admin/pages/TeamView.vue'),
        meta: { title: 'Equipo de trabajo', icon: 'UsersIcon',  roles: ['admin'], showInMenu: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.loading) {
    // Esperar a que cargue la sesión
    const unwatch = watch(
      () => authStore.loading,
      (loading) => {
        if (!loading) {
          unwatch();
          // Redirigir si no hay usuario
          if (!authStore.user && to.meta.requiresAuth) {
            next({ name: 'Login' });
          } else {
            next();
          }
        }
      }
    );
  } else {
    if (!authStore.user && to.meta.requiresAuth) {
      next({ name: 'Login' });
    } else {
      next();
    }
  }
});


export default router
