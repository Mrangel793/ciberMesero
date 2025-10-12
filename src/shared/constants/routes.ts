export const ROUTE_NAMES = {
  // Public routes
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',

  // Protected routes
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',

  // Admin routes
  ADMIN_DASHBOARD: 'admin-dashboard',

  // Restaurant routes
  RESTAURANT_DASHBOARD: 'restaurant-dashboard',

  // Customer routes
  CUSTOMER_DASHBOARD: 'customer-dashboard'
} as const;

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin',
  RESTAURANT_DASHBOARD: '/restaurant',
  CUSTOMER_DASHBOARD: '/customer'
} as const;
