/**
 * DTO para actualizar un miembro del equipo
 */
export interface UpdateTeamMemberDTO {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
}
