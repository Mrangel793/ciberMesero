import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export class CrearPlatoUseCase {
  constructor(private readonly repository: PlatoRepository) {}

  async execute(uidRestaurante: string, platoData: Omit<MenuItem, 'id'>): Promise<string> {
    if (!platoData.name || platoData.price <= 0) {
      throw new Error("Nombre y precio válido son requeridos para el plato.");
    }
    return this.repository.guardarPlato(uidRestaurante, platoData);
  }
}
