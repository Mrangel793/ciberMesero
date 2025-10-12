export const ROLES = {
  ADMIN: 'admin',
  WAITER: 'waiter',
  CUSTOMER: 'customer',
  RESTAURANT_OWNER: 'restaurant_owner'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
