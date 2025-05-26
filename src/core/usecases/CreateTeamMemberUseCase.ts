import type { TeamMember } from "../entities/TeamMember";
import type { TeamRepository } from '@/core/repositories/teamRepository';

export class CreateTeamMemberUseCase {
  constructor(private repo: TeamRepository) {}

  async execute(member: Omit<TeamMember, 'id'>): Promise<void> {
    if (!member.firstName || !member.lastName) {
      throw new Error("First name and last name are required.");
    }
    await this.repo.create(member)
  }
}
