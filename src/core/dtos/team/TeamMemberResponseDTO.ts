/**
 * DTO para respuesta de un miembro del equipo
 */
export interface TeamMemberResponseDTO {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  imageUrl?: string;
  uid: string;
}
