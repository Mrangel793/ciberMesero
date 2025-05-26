import type { CategoriaRepository } from "@/core/repositories/CategoriaRepository";

export class CrearCategoriaUseCase {
  constructor(private categoriaRepo: CategoriaRepository) {}

  async ejecutar(uid: string, nombre: string): Promise<void> {
    if(!nombre.trim()) throw new Error("El nombre de la categoria no puede estar vacio");
    await this.categoriaRepo.crear(uid, nombre.trim());
  }
}
