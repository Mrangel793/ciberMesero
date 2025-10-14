import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';
import { ValidationError } from '@/core/errors';

/**
 * Caso de uso para actualizar un plato existente
 * Valida los datos antes de persistir
 */
export class UpdatePlatoUseCase {
  constructor(private readonly platoRepository: PlatoRepository) {}

  async execute(
    platoId: string,
    datosPlato: Partial<Omit<MenuItem, 'id'>>,
    imageFile: File | null
  ): Promise<void> {
    // Validar ID del plato
    if (!platoId || platoId.trim() === '') {
      throw new ValidationError('El ID del plato es requerido', 'platoId');
    }

    // Validar datos si están presentes
    this.validate(datosPlato);

    // Delegar actualización al repositorio
    return this.platoRepository.actualizarPlato(platoId, datosPlato, imageFile);
  }

  private validate(datosPlato: Partial<Omit<MenuItem, 'id'>>): void {
    const errors: Record<string, string[]> = {};

    // Solo validar campos que están presentes
    if (datosPlato.name !== undefined) {
      if (datosPlato.name.trim() === '') {
        errors.name = ['El nombre no puede estar vacío'];
      } else if (datosPlato.name.length < 3) {
        errors.name = ['El nombre debe tener al menos 3 caracteres'];
      }
    }

    if (datosPlato.price !== undefined) {
      if (datosPlato.price <= 0) {
        errors.price = ['El precio debe ser mayor a 0'];
      }
    }

    if (datosPlato.category !== undefined) {
      if (datosPlato.category.trim() === '') {
        errors.category = ['La categoría no puede estar vacía'];
      }
    }

    // Si hay errores, lanzar ValidationError
    if (Object.keys(errors).length > 0) {
      throw new ValidationError(
        'Datos de actualización inválidos',
        undefined,
        errors
      );
    }
  }
}
