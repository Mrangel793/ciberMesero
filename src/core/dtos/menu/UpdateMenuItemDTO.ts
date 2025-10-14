/**
 * DTO para actualizar un ítem del menú
 * Todos los campos son opcionales ya que puede ser una actualización parcial
 */
export interface UpdateMenuItemDTO {
  name?: string;
  price?: number;
  category?: string;
  description?: string[];
  imageUrl?: string;
  oldPrice?: string;
  onPromo?: boolean;
  available?: boolean;
}
