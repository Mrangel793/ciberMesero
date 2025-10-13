import AdminLayout from '@/layouts/AdminLayout.vue';
import LandingView from '@/modules/home/pages/LandingView.vue'
import { useAuthStore } from '@/stores/auth';
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Esperar a que el estado de autenticación esté listo
  if (!authStore.authReady) {
    console.log("Esperando a que la autenticación esté lista...");
    await authStore.initAuthListener();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!authStore.user;

  // Si la ruta requiere autenticación y el usuario no está logueado...
  if (requiresAuth && !isAuthenticated) {
    // Redirige al login.
    console.log("Acceso denegado. Redirigiendo al login...");
    next({ name: 'Login' });
  }
  // Opcional: Si el usuario intenta ir a Login/Register pero ya está logueado...
  else if (['Login', 'Register'].includes(to.name as string) && isAuthenticated) {
    // Redirige al dashboard de admin.
    console.log("Usuario ya logueado. Redirigiendo al dashboard...");
    next({ name: 'AdminDashboard' });
  }
  // En cualquier otro caso, permite el acceso.
  else {
    next();
  }
});


// Navigation guard global para actualizar el título de la página
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'CiberMesero';
});

export default router;
