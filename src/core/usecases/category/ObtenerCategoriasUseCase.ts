import type { Category } from "@/core/entities/Category";
import type { CategoriaRepository } from "@/core/repositories/CategoriaRepository";

export class ObtenerCategoriasUseCase {
  constructor(private readonly repository: CategoriaRepository) {}

  async execute(uid: string): Promise<Category[]> {
    return await this.repository.obtenerTodas(uid)
  }
}
