import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';
import { ValidationError } from '@/core/errors';

/**
 * Caso de uso para obtener un plato por su ID
 */
export class GetPlatoByIdUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(platoId: string): Promise<MenuItem | null> {
    // Validar ID del plato
    if (!platoId || platoId.trim() === '') {
      throw new ValidationError('El ID del plato es requerido', 'platoId');
    }

    // Delegar búsqueda al repositorio
    return this.platoRepository.obtenerPlatoPorId(platoId);
  }
}
