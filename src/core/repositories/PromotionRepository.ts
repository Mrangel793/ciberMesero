import type { Promotion } from '../entities/Promotion';

export interface PromotionRepository {
  create(promotionData: Omit<Promotion, 'id'>): Promise<string>;
  getAll(): Promise<Promotion[]>;
  getById(promotionId: string): Promise<Promotion | null>;
  update(promotionId: string, promotionData: Partial<Omit<Promotion, 'id'>>, imageFile: File | null): Promise<void>;
  delete(promotionId: string): Promise<void>;
}
