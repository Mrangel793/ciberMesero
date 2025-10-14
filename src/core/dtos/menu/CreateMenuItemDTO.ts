/**
 * DTO para crear un nuevo ítem del menú
 */
export interface CreateMenuItemDTO {
  name: string;
  price: number;
  category: string;
  description?: string[];
  imageUrl?: string;
  oldPrice?: string;
  onPromo?: boolean;
  available?: boolean;
  uid: string;
}
