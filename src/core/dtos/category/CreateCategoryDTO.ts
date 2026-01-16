/**
 * DTO para crear una nueva categoría
 */
export interface CreateCategoryDTO {
  name: string;
  description?: string;
  uid: string;
}
