/**
 * DTO para respuesta de una promoción
 */
export interface PromotionResponseDTO {
  id: string;
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
