import type { TeamRepository } from '@/core/repositories/teamRepository'
import type { TeamMember } from '@/core/entities/TeamMember'

export class GetAllTeamMembersUseCase {
  constructor(private repo: TeamRepository) {}

  async execute(): Promise<TeamMember[]> {
    return await this.repo.getAll();
  }
}
