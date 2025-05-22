import type { TeamMember } from "../entities/TeamMember";
import type { TeamRepository } from "../repositories/teamRepository";

export class TraerEmpleadoPorIdUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(id: string): Promise<TeamMember | null> {
    try {
      const member = await this.teamRepository.getById(id);
      return member;
    } catch (error) {
      console.error("Error fetching team member by ID:", error);
      throw new Error("Failed to fetch team member by ID");
    }
  }
}
