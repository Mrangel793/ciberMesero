import type { AuthenticatedUser } from '@/core/interfaces/AuthenticatedUser'
import type { AuthRepository } from '@/core/repositories/AuthRepository'

export class LoginUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(email: string, password: string): Promise<AuthenticatedUser> {
    return this.authRepo.login(email, password)
  }
}
