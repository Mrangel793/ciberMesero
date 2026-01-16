import type { User } from "@/core/entities/User";


export interface UserRepository {
  register(user: Omit<User, 'uid' | 'createdAt'>, password: string): Promise<void>;

}
