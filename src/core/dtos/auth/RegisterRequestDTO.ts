import type { UserRole } from '@/shared/constants/roles';

/**
 * DTO para solicitud de registro
 */
export interface RegisterRequestDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  restaurantName?: string;
  phone?: string;
}
