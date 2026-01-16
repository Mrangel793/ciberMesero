/**
 * DTO para actualizar una promoción
 */
export interface UpdatePromotionDTO {
  title?: string;
  description?: string;
  discount?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  isActive?: boolean;
  address?: string;
  phone?: string;
}
