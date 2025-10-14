/**
 * DTO para crear una nueva promoción
 */
export interface CreatePromotionDTO {
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  isActive: boolean;
  address?: string;
  phone?: string;
  uid: string;
}
