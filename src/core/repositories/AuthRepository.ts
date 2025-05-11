import type { AuthenticatedUser } from "@/core/entities/AuthenticatedUser";


export interface AuthRepository {
  login(email: string, password: string): Promise<AuthenticatedUser>;
}
