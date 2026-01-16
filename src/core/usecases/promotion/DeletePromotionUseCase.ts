// src/core/usecases/promotion/DeletePromotionUseCase.ts
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';

export class DeletePromotionUseCase {
  constructor(
    private readonly promotionRepository: PromotionRepository
  ) {}

  async execute(
    promotionId: string,
    restaurantId?: string
  ): Promise<void> {

    // 1. Validación de Entrada Básica
    if (!promotionId || promotionId.trim() === '') {
      throw new Error("El ID de la promoción es obligatorio para la eliminación.");
    }

    // 2. (Opcional pero Recomendado) Verificar que la promoción existe antes de intentar eliminarla
    // y, si se proporciona restaurantId, verificar la pertenencia.
    // Esto evita intentos de eliminar algo que no existe o a lo que no se tiene acceso,
    // y puede proporcionar mensajes de error más claros.
    if (restaurantId) { // Solo si se necesita validar pertenencia
      const existingPromotion = await this.promotionRepository.getById(promotionId);

      if (!existingPromotion) {
        // Si la promoción no existe, algunos podrían considerar esto un éxito silencioso
        // (el estado deseado es que no exista). Otros prefieren un error.
        // Aquí lanzaremos un error para ser explícitos.
        throw new Error(`La promoción con ID '${promotionId}' no fue encontrada.`);
      }

      if (existingPromotion.restaurantId !== restaurantId) {
        // El usuario autenticado (identificado por restaurantId) no es el dueño de esta promoción.
        throw new Error("No tienes permiso para eliminar esta promoción o no pertenece a tu restaurante.");
      }
    } else {
      // Si no se proporciona restaurantId (por ejemplo, un superadmin eliminando),
      // podríamos verificar la existencia de todas formas, pero es menos crítico que la validación de pertenencia.
      // Si promotionRepository.delete() no lanza error si el ID no existe, esta verificación
      // previa podría ser redundante si solo importa el resultado final (que el doc no exista).
      // Sin embargo, para consistencia, podríamos hacerla:
      const existingPromotion = await this.promotionRepository.getById(promotionId);
      if (!existingPromotion) {
         console.warn(`Intento de eliminar una promoción con ID '${promotionId}' que no existe. La operación de eliminación procederá (puede que no haga nada en la BD).`);
         // No lanzamos error aquí, dejamos que el delete del repo maneje la no existencia.
      }
    }


    // 3. Llamar al Repositorio para Eliminar
    try {
      await this.promotionRepository.delete(promotionId);
      console.log(`Promoción con ID '${promotionId}' eliminada exitosamente.`);
    } catch (error) {
      console.error(`Error al eliminar la promoción con ID '${promotionId}' en el repositorio:`, error);
      // Re-empaquetar o añadir más contexto al error si es necesario
      throw new Error(`No se pudo eliminar la promoción: ${(error as Error).message}`);
    }
  }
}
