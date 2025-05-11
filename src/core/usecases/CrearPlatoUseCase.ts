import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '../repositories/PlatoRepository';

export class CrearPlatoUseCase {
  constructor(private readonly repository: PlatoRepository) {}

  async execute(uid: string, plato: MenuItem): Promise<void> {
    return await this.repository.guardarPlato(uid, plato)
  }
}
