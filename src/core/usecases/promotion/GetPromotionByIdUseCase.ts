// src/core/usecases/promotion/GetPromotionByIdUseCase.ts
import type { Promotion } from '@/core/entities/Promotion';
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';

export class GetPromotionByIdUseCase {
  constructor(
    private readonly promotionRepository: PromotionRepository
  ) {}

  async execute(promotionId: string, restaurantId?: string): Promise<Promotion | null> {
    // 1. Validación de Entrada
    if (!promotionId || promotionId.trim() === '') {
      throw new Error("El ID de la promoción es obligatorio.");
    }

    // 2. Obtener la promoción del repositorio
    let promotion: Promotion | null;
    try {
      promotion = await this.promotionRepository.getById(promotionId);
    } catch (error) {
      console.error(`Error al obtener la promoción con ID '${promotionId}' del repositorio:`, error);
      throw new Error(`No se pudo obtener la promoción: ${(error as Error).message}`);
    }

    // 3. Verificación Post-Recuperación (Lógica de Negocio)
    if (!promotion) {
      // La promoción no fue encontrada. Puedes devolver null o lanzar un error específico.
      // Devolver null es común para indicar "no encontrado".
      return null;
    }


    if (restaurantId && promotion.restaurantId !== restaurantId) {
      console.warn(`Intento de acceso a promoción '${promotionId}' que no pertenece al restaurante '${restaurantId}'.`);
      // Podrías lanzar un error de "no autorizado" o simplemente devolver null
      // throw new Error("No tienes permiso para ver esta promoción o no existe para tu restaurante.");
      return null;
    }


    // 4. Devolver la promoción
    return promotion;
  }
}
