import type { AuthenticatedUser } from "@/core/interfaces/AuthenticatedUser";


export interface AuthRepository {
  login(email: string, password: string): Promise<AuthenticatedUser>;
}
