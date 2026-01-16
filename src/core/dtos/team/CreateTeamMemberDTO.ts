/**
 * DTO para crear un nuevo miembro del equipo
 */
export interface CreateTeamMemberDTO {
  name: string;
  position: string;
  email: string;
  phone: string;
  imageUrl?: string;
  uid: string;
}
