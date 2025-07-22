import type { Promotion, PromotionDish } from '@/core/entities/Promotion';
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';


export interface UpdatePromotionInput {
  title?: string;
  description?: string;
  price?: number;
  dishIds?: string[];
  startDate?: string;
  endDate?: string;
}

export class UpdatePromotionUseCase {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly dishRepository?: PlatoRepository // Opcional, para validar platillos si se cambian
  ) { }

  async execute(
    promotionId: string,      // ID de la promoción a actualizar
    updateData: UpdatePromotionInput,
    imageFile: File | null
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


    // 3. Construir el objeto con los datos parciales a actualizar
    // Este objeto solo contendrá los campos que realmente se quieren cambiar.
    const dataToPersist: Partial<Omit<Promotion, 'id' | 'restaurantId' | 'restaurantName'>> = {};

    // 4. Validar y Mapear cada campo de updateData
    if (updateData.title !== undefined) {
      if (updateData.title.trim() === '') throw new Error("El título no puede estar vacío.");
      dataToPersist.title = updateData.title.trim();
    }
    if (updateData.description !== undefined) {
      if (updateData.description.trim() === '') throw new Error("La descripción no puede estar vacía.");
      dataToPersist.description = updateData.description.trim();
    }
    if (updateData.price !== undefined) {
      if (typeof updateData.price !== 'number' || updateData.price < 0) {
        throw new Error("El precio debe ser un número positivo.");
      }
      dataToPersist.price = updateData.price;
    }


    // 5. Validar Fechas (si se proporcionan y con respecto a la otra fecha existente o nueva)
    const newStartDateString = updateData.startDate !== undefined ? updateData.startDate : existingPromotion.startDate;
    const newEndDateString = updateData.endDate !== undefined ? updateData.endDate : existingPromotion.endDate;

    if (updateData.startDate !== undefined || updateData.endDate !== undefined) {
      const newStartDate = new Date(newStartDateString);
      const newEndDate = new Date(newEndDateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

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


    // 6. Validar y Mapear Platillos (si se permite su modificación)
    if(updateData.dishIds !== undefined) {
      if (updateData.dishIds.length === 0) {
        throw new Error("Se debe seleccionar al menos un platillo.");
      }
      const newPromotionDishes: PromotionDish[] = [];
      for (const dishId of updateData.dishIds) {
        // El método de obtener plato ahora es más simple
        const dish = await this.dishRepository.obtenerPlatoPorId(dishId);
        if (!dish) {
          throw new Error(`El platillo con ID '${dishId}' no existe en el menú.`);
        }
        newPromotionDishes.push({ id: dish.id, name: dish.name });
      }
      dataToPersist.dishes = newPromotionDishes;
    }

    // 7. Verificar si realmente hay cambios para persistir
    if (Object.keys(dataToPersist).length === 0 && !imageFile) {
      console.warn("No hay cambios detectados para actualizar.");
      return;
    }

    // 8. Llamar al Repositorio para Actualizar
    try {
      await this.promotionRepository.update(promotionId, dataToPersist, imageFile);
    } catch (error) {
      console.error(`Error al actualizar la promoción '${promotionId}' en el repositorio:`, error);
      throw new Error(`No se pudo actualizar la promoción: ${(error as Error).message}`);
    }

  }
}
