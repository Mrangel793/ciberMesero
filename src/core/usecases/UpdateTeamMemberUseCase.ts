import type { TeamMember } from "../entities/TeamMember";
import type { TeamRepository } from "../repositories/teamRepository";

export class UpdateTeamMemberUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(id: string, memberData: Partial<TeamMember>): Promise<void> {
    // Aquí podrías añadir validaciones de negocio antes de actualizar
    if (!id) {
      throw new Error("Member ID is required for update.");
    }
    // No permitir actualizar ciertos campos, etc.
    return this.teamRepository.update(id, memberData);
  }
}
