import type { Promotion } from '../entities/Promotion';

export interface PromotionRepository {
  create(uidRestaurante: string, promotionData: Omit<Promotion, 'id' | 'restaurantName'>): Promise<string>; // Devuelve el ID de la nueva promo
  getAll(uidRestaurante?: string): Promise<Promotion[]>; // uidRestaurante opcional para obtener todas o de un restaurante específico
  getById(promotionId: string): Promise<Promotion | null>; // Asume que el ID de la promo es globalmente único o se busca dentro de un restaurante
  update(promotionId: string, promotionData: Partial<Omit<Promotion, 'id' | 'restaurantId' | 'restaurantName'>>): Promise<void>;
  delete(promotionId: string): Promise<void>;
}
