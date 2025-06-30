// src/core/usecases/promotion/UpdatePromotionUseCase.ts
import type { Promotion, PromotionDish } from '@/core/entities/Promotion';
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';


export interface UpdatePromotionInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  dishIds?: string[]; // Si se permite cambiar los platillos, se pasan los nuevos IDs
  startDate?: string; // Formato YYYY-MM-DD
  endDate?: string;   // Formato YYYY-MM-DD
  address?: string;
  phone?: string;
}

export class UpdatePromotionUseCase {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly dishRepository?: PlatoRepository // Opcional, para validar platillos si se cambian
  ) {}

  async execute(
    promotionId: string,      // ID de la promoción a actualizar
    updateData: UpdatePromotionInput,
    restaurantId?: string
  ): Promise<void> {

    // 1. Validación de Entradas Básicas
    if (!promotionId || promotionId.trim() === '') {
      throw new Error("El ID de la promoción es obligatorio para la actualización.");
    }
    if (Object.keys(updateData).length === 0) {
      // Si no hay datos para actualizar, no hacer nada o lanzar advertencia/error.
      console.warn("No se proporcionaron datos para actualizar la promoción.");
      return; // O throw new Error("No hay datos para actualizar.");
    }

    // 2. Obtener la Promoción Existente
    // Esto es crucial para validar que existe y para ciertas lógicas de negocio (ej. comparar fechas).
    const existingPromotion = await this.promotionRepository.getById(promotionId);
    if (!existingPromotion) {
      throw new Error(`La promoción con ID '${promotionId}' no fue encontrada y no puede ser actualizada.`);
    }

    // 3. Validación de Pertenencia/Autorización (Opcional)
    if (restaurantId && existingPromotion.restaurantId !== restaurantId) {
      throw new Error("No tienes permiso para actualizar esta promoción o no pertenece a tu restaurante.");
    }

    // 4. Construir el objeto con los datos parciales a actualizar
    // Este objeto solo contendrá los campos que realmente se quieren cambiar.
    const dataToPersist: Partial<Omit<Promotion, 'id' | 'restaurantId' | 'restaurantName'>> = {};

    // 5. Validar y Mapear cada campo de updateData
    if (updateData.title !== undefined) {
      if (updateData.title.trim() === '') throw new Error("El título no puede estar vacío.");
      dataToPersist.title = updateData.title.trim();
    }
    if (updateData.description !== undefined) {
      if (updateData.description.trim() === '') throw new Error("La descripción no puede estar vacía.");
      dataToPersist.description = updateData.description.trim();
    }
    if (updateData.imageUrl !== undefined) {
      if (updateData.imageUrl.trim() !== '') {
        try { new URL(updateData.imageUrl); } catch (_) {
          console.warn("La URL de la imagen proporcionada podría no ser válida:", updateData.imageUrl);
        }
      }
      dataToPersist.imageUrl = updateData.imageUrl.trim() === '' ? undefined : updateData.imageUrl.trim(); // Permite borrar la imagen
    }
    if (updateData.price !== undefined) {
      if (typeof updateData.price !== 'number' || updateData.price < 0) {
        throw new Error("El precio debe ser un número positivo.");
      }
      dataToPersist.price = updateData.price;
    }
    if (updateData.address !== undefined) {
      dataToPersist.address = updateData.address.trim();
    }
    if (updateData.phone !== undefined) {
      dataToPersist.phone = updateData.phone.trim();
    }


    // 6. Validar Fechas (si se proporcionan y con respecto a la otra fecha existente o nueva)
    const newStartDateString = updateData.startDate !== undefined ? updateData.startDate : existingPromotion.startDate;
    const newEndDateString = updateData.endDate !== undefined ? updateData.endDate : existingPromotion.endDate;

    if (updateData.startDate !== undefined || updateData.endDate !== undefined) {
        const newStartDate = new Date(newStartDateString);
        const newEndDate = new Date(newEndDateString);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
            throw new Error("Las fechas de inicio o fin no tienen un formato válido.");
        }
        if (newStartDate < today && newStartDateString !== today.toISOString().split('T')[0]) {
            throw new Error("La fecha de inicio no puede ser en el pasado.");
        }
        if (newEndDate < newStartDate) {
            throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio.");
        }
        if (updateData.startDate !== undefined) dataToPersist.startDate = newStartDateString;
        if (updateData.endDate !== undefined) dataToPersist.endDate = newEndDateString;
    }


    // 7. Validar y Mapear Platillos (si se permite su modificación)
    if (updateData.dishIds !== undefined) {
      if (updateData.dishIds.length === 0) {
        throw new Error("Se debe seleccionar al menos un platillo para la promoción.");
      }
      const newPromotionDishes: PromotionDish[] = [];
      if (this.dishRepository) {
        for (const dishId of updateData.dishIds) {
          // Validar que el platillo exista y pertenezca al restaurante de la promoción
          const dish = await this.dishRepository.obtenerPlatoPorId(existingPromotion.restaurantId, dishId);
          if (!dish) {
            throw new Error(`El platillo con ID '${dishId}' no existe o no pertenece al restaurante.`);
          }
          newPromotionDishes.push({ id: dish.id, name: dish.name });
        }
      } else {
        // Si no hay dishRepository, confiamos en los IDs y usamos nombres genéricos
        updateData.dishIds.forEach(id => newPromotionDishes.push({ id, name: `Platillo ${id}` }));
        console.warn("DishRepository no proporcionado. Los nombres de los platillos actualizados pueden no ser precisos.");
      }
      dataToPersist.dishes = newPromotionDishes;
    }

    // 8. Verificar si realmente hay cambios para persistir
    if (Object.keys(dataToPersist).length === 0) {
      console.warn("No hay cambios detectados para actualizar la promoción.");
      return; // No hay nada que actualizar
    }

    // 9. Llamar al Repositorio para Actualizar
    try {
      await this.promotionRepository.update(promotionId, dataToPersist);
    } catch (error) {
      console.error(`Error al actualizar la promoción con ID '${promotionId}' en el repositorio:`, error);
      throw new Error(`No se pudo actualizar la promoción: ${(error as Error).message}`);
    }
  }
}
