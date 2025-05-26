import type { Category } from "../entities/Category";
import type { CategoriaRepository } from "../repositories/CategoriaRepository";

export class ObtenerCategoriasUseCase {
  constructor(private readonly repository: CategoriaRepository) {}

  async execute(uid: string): Promise<Category[]> {
    return await this.repository.obtenerTodas(uid)
  }
}
