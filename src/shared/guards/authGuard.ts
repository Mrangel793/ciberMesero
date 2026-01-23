import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants/routes';
import type { UserRole } from '@/shared/constants/roles';

/**
 * Guard que verifica si el usuario está autenticado
 */
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore();

  // Esperar a que se inicialice el estado de autenticación
  if (!authStore.authReady) {
    await authStore.initAuthListener();
  }

  if (!authStore.isAuthenticated) {
    // Redirigir al login si no está autenticado
    next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

/**
 * Guard que verifica si el usuario NO está autenticado (para páginas públicas como login/register)
 */
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore();

  // Esperar a que se inicialice el estado de autenticación
  if (!authStore.authReady) {
    await authStore.initAuthListener();
  }

  if (authStore.isAuthenticated) {
    // Si ya está autenticado, redirigir al dashboard según su rol
    next({ path: getDashboardByRole(authStore.userRole as UserRole) });
  } else {
    next();
  }
};

/**
 * Guard que verifica el rol del usuario
 */
export const roleGuard = (allowedRoles: UserRole[]) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): Promise<void> => {
    const authStore = useAuthStore();

    // Esperar a que se inicialice el estado de autenticación
    if (!authStore.authReady) {
      await authStore.initAuthListener();
    }

    if (!authStore.isAuthenticated) {
      next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } });
      return;
    }

    const role = authStore.userRole as UserRole;
    if (!role || !allowedRoles.includes(role)) {
      // Redirigir al dashboard del usuario si no tiene permisos
      next({ path: getDashboardByRole(role) });
    } else {
      next();
    }
  };
};

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 */
function getDashboardByRole(role: UserRole | null): string {
  switch (role) {
    case 'admin':
      return ROUTE_PATHS.ADMIN_DASHBOARD;
    case 'restaurant_owner':
      return ROUTE_PATHS.RESTAURANT_DASHBOARD;
    case 'customer':
      return ROUTE_PATHS.CUSTOMER_DASHBOARD;
    default:
      return ROUTE_PATHS.HOME;
  }
}
