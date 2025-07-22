import type { MenuItem } from "@/core/entities/MenuItem";
import type { PlatoRepository } from "@/core/repositories/PlatoRepository";

export class ObtenerPlatosUseCase {
  constructor(private readonly platoRepo: PlatoRepository) {}

  async execute(): Promise<MenuItem[]> {
    return await this.platoRepo.obtenerMenu();
  }
}
