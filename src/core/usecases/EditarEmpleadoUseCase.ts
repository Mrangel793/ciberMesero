import type { TeamMember } from "../entities/TeamMember";
import type { TeamRepository } from "../repositories/teamRepository";

export class EditarEmpleadoUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(id: string, memberData: Partial<TeamMember>): Promise<void> {
    try {
      await this.teamRepository.update(id, memberData);
    } catch (error) {
      console.error("Error updating team member:", error);
      throw new Error("Failed to update team member");
    }
  }
}
