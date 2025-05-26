import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export class UpdatePlatoUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(uidRestaurante: string, platoId: string, datosPlato: Partial<Omit<MenuItem, 'id'>>): Promise<void> {
    if (datosPlato.price !== undefined && datosPlato.price < 0) {
      throw new Error("El precio del plato no puede ser negativo.");
    }
    return this.platoRepository.actualizarPlato(uidRestaurante, platoId, datosPlato);
  }
}
