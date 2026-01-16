import type { TeamRepository } from "@/core/repositories/teamRepository";

export class DeleteTeamMemberUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("Member ID is required for deletion.");
    }
    try {
      await this.teamRepository.delete(id);
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw new Error("Failed to delete team member");
    }
  }
}
