import type { PlatoRepository } from '@/core/repositories/PlatoRepository';
import { ValidationError } from '@/core/errors';

/**
 * Caso de uso para eliminar un plato
 */
export class DeletePlatoUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(platoId: string): Promise<void> {
    // Validar ID del plato
    if (!platoId || platoId.trim() === '') {
      throw new ValidationError('El ID del plato es requerido', 'platoId');
    }

    // Delegar eliminación al repositorio
    return this.platoRepository.eliminarPlato(platoId);
  }
}
