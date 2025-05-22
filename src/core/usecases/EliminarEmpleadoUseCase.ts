import type { TeamRepository } from "../repositories/teamRepository";

export class EliminarEmpleadoUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(id: string): Promise<void> {
    try {
      await this.teamRepository.delete(id);
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw new Error("Failed to delete team member");
    }
  }
}
