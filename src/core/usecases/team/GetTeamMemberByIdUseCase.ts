import type { TeamMember } from "../entities/TeamMember";
import type { TeamRepository } from "../repositories/teamRepository";

export class GetTeamMemberByIdUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(id: string): Promise<TeamMember | null> {
    if (!id) {
      throw new Error("Member ID is required to retrieve a team member.");
    }
    try {
      const member = await this.teamRepository.getById(id);
      if (!member) {
        throw new Error(`No team member found with ID: ${id}`);
      }
      return member;
    } catch (error) {
      console.error("Error retrieving team member:", error);
      throw new Error("Failed to retrieve team member");
    }
  }
}
