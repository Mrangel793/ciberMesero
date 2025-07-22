import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export class GetPlatoByIdUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(platoId: string): Promise<MenuItem | null> {
    return this.platoRepository.obtenerPlatoPorId(platoId);
  }
}
