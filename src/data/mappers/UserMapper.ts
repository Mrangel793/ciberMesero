import type { User } from '@/core/entities/User';
import type { AuthenticatedUser } from '@/core/entities/AuthenticatedUser';
import type { LoginResponseDTO, RegisterRequestDTO } from '@/core/dtos';
import type { DocumentData } from 'firebase/firestore';

/**
 * Mapper para transformar datos de usuario entre diferentes capas
 */
export class UserMapper {
  /**
   * Convierte un documento de Firestore a una entidad User
   */
  static fromFirestore(doc: DocumentData, uid: string): User {
    return {
      uid,
      name: doc.name || '',
      email: doc.email || '',
      role: doc.role || 'customer',
      createdAt: doc.createdAt?.toDate?.() || new Date(doc.createdAt),
      restaurantInfo: doc.restaurantInfo ? {
        plan: doc.restaurantInfo.plan || '',
        pruebaActiva: doc.restaurantInfo.pruebaActiva || false,
        estadoPlan: doc.restaurantInfo.estadoPlan || '',
        fechaInicio: doc.restaurantInfo.fechaInicio?.toDate?.() || new Date(doc.restaurantInfo.fechaInicio),
      } : undefined,
      clientInfo: doc.clientInfo ? {
        preferencias: doc.clientInfo.preferencias || [],
        favoritos: doc.clientInfo.favoritos || [],
      } : undefined,
    };
  }

  /**
   * Convierte una entidad User a datos para Firestore (omitiendo uid)
   */
  static toFirestore(user: User): DocumentData {
    const data: DocumentData = {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    if (user.restaurantInfo) {
      data.restaurantInfo = {
        plan: user.restaurantInfo.plan,
        pruebaActiva: user.restaurantInfo.pruebaActiva,
        estadoPlan: user.restaurantInfo.estadoPlan,
        fechaInicio: user.restaurantInfo.fechaInicio,
      };
    }

    if (user.clientInfo) {
      data.clientInfo = {
        preferencias: user.clientInfo.preferencias,
        favoritos: user.clientInfo.favoritos,
      };
    }

    return data;
  }

  /**
   * Convierte un documento de Firestore a AuthenticatedUser
   */
  static toAuthenticatedUser(doc: DocumentData, uid: string): AuthenticatedUser {
    return {
      uid,
      name: doc.name || '',
      email: doc.email || '',
      role: doc.role || 'customer',
    };
  }

  /**
   * Convierte AuthenticatedUser a LoginResponseDTO
   */
  static toLoginResponseDTO(user: AuthenticatedUser): LoginResponseDTO {
    return {
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  /**
   * Convierte RegisterRequestDTO a datos para crear usuario en Firestore
   */
  static fromRegisterDTO(dto: RegisterRequestDTO): DocumentData {
    const data: DocumentData = {
      name: dto.name,
      email: dto.email,
      role: dto.role || 'customer',
      createdAt: new Date(),
    };

    if (dto.role === 'admin' && (dto.restaurantName || dto.phone)) {
      data.restaurantInfo = {
        name: dto.restaurantName,
        phone: dto.phone,
        plan: 'free',
        pruebaActiva: true,
        estadoPlan: 'activo',
        fechaInicio: new Date(),
      };
    }

    return data;
  }
}
