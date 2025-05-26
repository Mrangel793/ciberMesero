import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export class DeletePlatoUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(uidRestaurante: string, platoId: string): Promise<void> {
    return this.platoRepository.eliminarPlato(uidRestaurante, platoId);
  }
}
