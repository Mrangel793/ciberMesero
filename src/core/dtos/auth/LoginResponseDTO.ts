import type { UserRole } from '@/shared/constants/roles';

/**
 * DTO para respuesta de login
 */
export interface LoginResponseDTO {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}
