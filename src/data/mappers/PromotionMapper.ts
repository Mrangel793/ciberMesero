import type { Promotion } from '@/core/entities/Promotion';
import type { CreatePromotionDTO, UpdatePromotionDTO, PromotionResponseDTO } from '@/core/dtos';
import type { DocumentData } from 'firebase/firestore';

/**
 * Mapper para transformar datos de Promotion entre diferentes capas
 */
export class PromotionMapper {
  /**
   * Convierte un documento de Firestore a una entidad Promotion
   */
  static fromFirestore(doc: DocumentData, id: string): Promotion {
    return {
      id,
      title: doc.title || '',
      description: doc.description || '',
      imageUrl: doc.imageUrl,
      price: doc.price || doc.discount || 0, // Compatibilidad con ambos campos
      dishes: doc.dishes || [],
      startDate: doc.startDate || '',
      endDate: doc.endDate || '',
      address: doc.address,
      phone: doc.phone,
    };
  }

  /**
   * Convierte una entidad Promotion a datos para Firestore (omitiendo id)
   */
  static toFirestore(promotion: Promotion): DocumentData {
    const data: DocumentData = {
      title: promotion.title,
      description: promotion.description,
      price: promotion.price,
      dishes: promotion.dishes,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
    };

    if (promotion.imageUrl) {
      data.imageUrl = promotion.imageUrl;
    }
    if (promotion.address) {
      data.address = promotion.address;
    }
    if (promotion.phone) {
      data.phone = promotion.phone;
    }

    return data;
  }

  /**
   * Convierte CreatePromotionDTO a datos para Firestore
   */
  static fromCreateDTO(dto: CreatePromotionDTO): DocumentData {
    const data: DocumentData = {
      title: dto.title,
      description: dto.description,
      discount: dto.discount,
      startDate: dto.startDate,
      endDate: dto.endDate,
      isActive: dto.isActive,
      uid: dto.uid,
    };

    if (dto.imageUrl) {
      data.imageUrl = dto.imageUrl;
    }
    if (dto.address) {
      data.address = dto.address;
    }
    if (dto.phone) {
      data.phone = dto.phone;
    }

    return data;
  }

  /**
   * Convierte UpdatePromotionDTO a datos parciales para Firestore
   */
  static fromUpdateDTO(dto: UpdatePromotionDTO): DocumentData {
    const data: DocumentData = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.discount !== undefined) data.discount = dto.discount;
    if (dto.startDate !== undefined) data.startDate = dto.startDate;
    if (dto.endDate !== undefined) data.endDate = dto.endDate;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.phone !== undefined) data.phone = dto.phone;

    return data;
  }

  /**
   * Convierte Promotion a PromotionResponseDTO
   */
  static toResponseDTO(promotion: Promotion, uid: string): PromotionResponseDTO {
    return {
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      discount: promotion.price, // Mapear price a discount
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      imageUrl: promotion.imageUrl,
      isActive: true, // Por defecto true, ajustar según lógica
      address: promotion.address,
      phone: promotion.phone,
      uid,
    };
  }

  /**
   * Convierte un array de Promotion a array de PromotionResponseDTO
   */
  static toResponseDTOList(promotions: Promotion[], uid: string): PromotionResponseDTO[] {
    return promotions.map(promo => this.toResponseDTO(promo, uid));
  }
}
