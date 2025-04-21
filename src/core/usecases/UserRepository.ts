import type { User } from "../interfaces/User";


export interface UserRepository {
  register(user: Omit<User, 'uid' | 'createdAt'>, password: string): Promise<void>;
  // Agrega más si quieres:
  // getUserById(uid: string): Promise<User | null>;
  // updateUser(uid: string, data: Partial<User>): Promise<void>;
}
