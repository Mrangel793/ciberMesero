import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export class DeleteVariosPlatosUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(uidRestaurante: string, platoIds: string[]): Promise<void> {
    if (!platoIds || platoIds.length === 0) {
      // Opcional: lanzar error o simplemente no hacer nada
      console.warn("No se proporcionaron IDs de platos para eliminar.");
      return;
    }
    if (!this.platoRepository.eliminarVariosPlatos) {
        throw new Error("La funcionalidad de eliminar varios platos no está implementada en el repositorio.");
    }
    return this.platoRepository.eliminarVariosPlatos(uidRestaurante, platoIds);
  }
}
