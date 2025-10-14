/**
 * DTO para respuesta de un ítem del menú
 */
export interface MenuItemResponseDTO {
  id: string;
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
