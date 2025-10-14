import type { TeamMember } from '@/core/entities/TeamMember';
import type { CreateTeamMemberDTO, UpdateTeamMemberDTO, TeamMemberResponseDTO } from '@/core/dtos';
import type { DocumentData } from 'firebase/firestore';

/**
 * Mapper para transformar datos de TeamMember entre diferentes capas
 * NOTA: Hay un desajuste entre la entidad TeamMember (firstName, lastName, document, emergencyContact)
 * y el DTO (name, position, email, phone). Este mapper hace la conversión necesaria.
 */
export class TeamMemberMapper {
  /**
   * Convierte un documento de Firestore a una entidad TeamMember
   */
  static fromFirestore(doc: DocumentData, id: string): TeamMember {
    return {
      id,
      firstName: doc.firstName || doc.name?.split(' ')[0] || '',
      lastName: doc.lastName || doc.name?.split(' ').slice(1).join(' ') || '',
      document: doc.document || '',
      phone: doc.phone || '',
      email: doc.email || '',
      role: doc.role || doc.position || '',
      emergencyContact: doc.emergencyContact || {
        name: '',
        email: '',
        phone: '',
      },
    };
  }

  /**
   * Convierte una entidad TeamMember a datos para Firestore (omitiendo id)
   */
  static toFirestore(member: TeamMember): DocumentData {
    return {
      firstName: member.firstName,
      lastName: member.lastName,
      document: member.document,
      phone: member.phone,
      email: member.email,
      role: member.role,
      emergencyContact: member.emergencyContact,
    };
  }

  /**
   * Convierte CreateTeamMemberDTO a datos para Firestore
   */
  static fromCreateDTO(dto: CreateTeamMemberDTO): DocumentData {
    // Dividir name en firstName y lastName
    const nameParts = dto.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      firstName,
      lastName,
      name: dto.name, // Guardar también el nombre completo
      position: dto.position,
      email: dto.email,
      phone: dto.phone,
      imageUrl: dto.imageUrl,
      uid: dto.uid,
      // Campos de la entidad original
      document: '', // No viene en el DTO
      role: dto.position,
      emergencyContact: {
        name: '',
        email: '',
        phone: '',
      },
    };
  }

  /**
   * Convierte UpdateTeamMemberDTO a datos parciales para Firestore
   */
  static fromUpdateDTO(dto: UpdateTeamMemberDTO): DocumentData {
    const data: DocumentData = {};

    if (dto.name !== undefined) {
      const nameParts = dto.name.split(' ');
      data.firstName = nameParts[0] || '';
      data.lastName = nameParts.slice(1).join(' ') || '';
      data.name = dto.name;
    }
    if (dto.position !== undefined) {
      data.position = dto.position;
      data.role = dto.position;
    }
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;

    return data;
  }

  /**
   * Convierte TeamMember a TeamMemberResponseDTO
   */
  static toResponseDTO(member: TeamMember, uid: string): TeamMemberResponseDTO {
    const fullName = `${member.firstName} ${member.lastName}`.trim();

    return {
      id: member.id,
      name: fullName,
      position: member.role,
      email: member.email,
      phone: member.phone,
      imageUrl: undefined, // La entidad no tiene imageUrl
      uid,
    };
  }

  /**
   * Convierte un array de TeamMember a array de TeamMemberResponseDTO
   */
  static toResponseDTOList(members: TeamMember[], uid: string): TeamMemberResponseDTO[] {
    return members.map(member => this.toResponseDTO(member, uid));
  }
}
