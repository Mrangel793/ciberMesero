import type { MenuItem } from "../interfaces/MenuItem";
import type { PlatoRepository } from "../repositories/PlatoRepository";

export class ObtenerPlatosUseCase {
  constructor(private readonly platoRepo: PlatoRepository) {}

  async execute(uidRestaurante: string): Promise<MenuItem[]> {
    return await this.platoRepo.obtenerMenu(uidRestaurante);
  }
}
