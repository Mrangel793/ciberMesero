import type { MenuItem } from '@/core/entities/MenuItem';
import type { CreateMenuItemDTO, UpdateMenuItemDTO, MenuItemResponseDTO } from '@/core/dtos';
import type { DocumentData } from 'firebase/firestore';

/**
 * Mapper para transformar datos de MenuItem entre diferentes capas
 */
export class MenuItemMapper {
  /**
   * Convierte un documento de Firestore a una entidad MenuItem
   */
  static fromFirestore(doc: DocumentData, id: string): MenuItem {
    return {
      id,
      name: doc.name || '',
      price: doc.price || 0,
      category: doc.category || '',
      description: doc.description || [],
      imageUrl: doc.imageUrl,
      oldPrice: doc.oldPrice,
      onPromo: doc.onPromo || false,
      available: doc.available !== undefined ? doc.available : true,
      uid: doc.uid || '',
    };
  }

  /**
   * Convierte una entidad MenuItem a datos para Firestore (omitiendo id)
   */
  static toFirestore(menuItem: MenuItem): DocumentData {
    const data: DocumentData = {
      name: menuItem.name,
      price: menuItem.price,
      category: menuItem.category,
      uid: menuItem.uid,
    };

    // Solo añadir campos opcionales si tienen valor
    if (menuItem.description && menuItem.description.length > 0) {
      data.description = menuItem.description;
    }
    if (menuItem.imageUrl) {
      data.imageUrl = menuItem.imageUrl;
    }
    if (menuItem.oldPrice) {
      data.oldPrice = menuItem.oldPrice;
    }
    if (menuItem.onPromo !== undefined) {
      data.onPromo = menuItem.onPromo;
    }
    if (menuItem.available !== undefined) {
      data.available = menuItem.available;
    }

    return data;
  }

  /**
   * Convierte CreateMenuItemDTO a datos para Firestore
   */
  static fromCreateDTO(dto: CreateMenuItemDTO): DocumentData {
    const data: DocumentData = {
      name: dto.name,
      price: dto.price,
      category: dto.category,
      uid: dto.uid,
    };

    if (dto.description && dto.description.length > 0) {
      data.description = dto.description;
    }
    if (dto.imageUrl) {
      data.imageUrl = dto.imageUrl;
    }
    if (dto.oldPrice) {
      data.oldPrice = dto.oldPrice;
    }
    if (dto.onPromo !== undefined) {
      data.onPromo = dto.onPromo;
    }
    if (dto.available !== undefined) {
      data.available = dto.available;
    }

    return data;
  }

  /**
   * Convierte UpdateMenuItemDTO a datos parciales para Firestore
   */
  static fromUpdateDTO(dto: UpdateMenuItemDTO): DocumentData {
    const data: DocumentData = {};

    // Solo incluir campos que están presentes en el DTO
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.oldPrice !== undefined) data.oldPrice = dto.oldPrice;
    if (dto.onPromo !== undefined) data.onPromo = dto.onPromo;
    if (dto.available !== undefined) data.available = dto.available;

    return data;
  }

  /**
   * Convierte MenuItem a MenuItemResponseDTO
   */
  static toResponseDTO(menuItem: MenuItem): MenuItemResponseDTO {
    return {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      category: menuItem.category,
      description: menuItem.description,
      imageUrl: menuItem.imageUrl,
      oldPrice: menuItem.oldPrice,
      onPromo: menuItem.onPromo,
      available: menuItem.available,
      uid: menuItem.uid,
    };
  }

  /**
   * Convierte un array de MenuItem a array de MenuItemResponseDTO
   */
  static toResponseDTOList(menuItems: MenuItem[]): MenuItemResponseDTO[] {
    return menuItems.map(item => this.toResponseDTO(item));
  }
}
