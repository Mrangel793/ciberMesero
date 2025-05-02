import type { User } from '@/core/interfaces/User'
import type { UserRepository } from '@/data/repositories/UserRepository'

export class RegisterUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: Omit<User, 'uid' | 'createdAt'>, password: string): Promise<void> {
    await this.repository.register(user, password)
  }
}
