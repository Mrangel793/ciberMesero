import type { Category } from '@/core/entities/Category';
import type { CreateCategoryDTO, CategoryResponseDTO } from '@/core/dtos';
import type { DocumentData } from 'firebase/firestore';

/**
 * Mapper para transformar datos de Category entre diferentes capas
 */
export class CategoryMapper {
  /**
   * Convierte un documento de Firestore a una entidad Category
   */
  static fromFirestore(doc: DocumentData, id: string): Category {
    return {
      id,
      name: doc.name || '',
    };
  }

  /**
   * Convierte una entidad Category a datos para Firestore (omitiendo id)
   */
  static toFirestore(category: Category): DocumentData {
    return {
      name: category.name,
    };
  }

  /**
   * Convierte CreateCategoryDTO a datos para Firestore
   */
  static fromCreateDTO(dto: CreateCategoryDTO): DocumentData {
    const data: DocumentData = {
      name: dto.name,
    };

    if (dto.description) {
      data.description = dto.description;
    }

    return data;
  }

  /**
   * Convierte Category a CategoryResponseDTO
   */
  static toResponseDTO(category: Category): CategoryResponseDTO {
    return {
      id: category.id,
      name: category.name,
      uid: '', // Agregar uid si lo tienes en la entidad
    };
  }

  /**
   * Convierte un array de Category a array de CategoryResponseDTO
   */
  static toResponseDTOList(categories: Category[]): CategoryResponseDTO[] {
    return categories.map(cat => this.toResponseDTO(cat));
  }
}
