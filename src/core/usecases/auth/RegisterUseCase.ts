import type { User } from '@/core/entities/User'
import type { UserRepository } from '@/core/repositories/UserRepository'

export class RegisterUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: Omit<User, 'uid' | 'createdAt'>, password: string): Promise<void> {
    await this.repository.register(user, password)
  }
}
