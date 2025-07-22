import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export class DeletePlatoUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(platoId: string): Promise<void> {
    return this.platoRepository.eliminarPlato(platoId);
  }
}
