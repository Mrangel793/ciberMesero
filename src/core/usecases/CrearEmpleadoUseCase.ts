import type { TeamMember } from "../entities/TeamMember";
import type { TeamRepository } from '@/core/repositories/teamRepository';

export class CrearEmpleadoUseCase {
  constructor(private repo: TeamRepository) {}

  async execute(member: TeamMember): Promise<void> {
    // Aquí podrías añadir validaciones de negocio si las necesitas
    await this.repo.create(member)
  }
}
