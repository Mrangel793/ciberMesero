import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';
import { ValidationError } from '@/core/errors';

/**
 * Caso de uso para crear un nuevo plato
 * Valida los datos antes de persistir
 */
export class CrearPlatoUseCase {
  constructor(private readonly repository: PlatoRepository) {}

  async execute(platoData: Omit<MenuItem, 'id'>): Promise<string> {
    // Validaciones de negocio
    this.validate(platoData);

    // Delegar la persistencia al repositorio
    return this.repository.guardarPlato(platoData);
  }

  private validate(platoData: Omit<MenuItem, 'id'>): void {
    const errors: Record<string, string[]> = {};

    // Validar nombre
    if (!platoData.name || platoData.name.trim() === '') {
      errors.name = ['El nombre del plato es requerido'];
    } else if (platoData.name.length < 3) {
      errors.name = ['El nombre debe tener al menos 3 caracteres'];
    }

    // Validar precio
    if (platoData.price === undefined || platoData.price === null) {
      errors.price = ['El precio es requerido'];
    } else if (platoData.price <= 0) {
      errors.price = ['El precio debe ser mayor a 0'];
    }

    // Validar categoría
    if (!platoData.category || platoData.category.trim() === '') {
      errors.category = ['La categoría es requerida'];
    }

    // Validar UID
    if (!platoData.uid || platoData.uid.trim() === '') {
      errors.uid = ['El UID del restaurante es requerido'];
    }

    // Si hay errores, lanzar ValidationError
    if (Object.keys(errors).length > 0) {
      throw new ValidationError(
        'Datos de plato inválidos',
        undefined,
        errors
      );
    }
  }
}
