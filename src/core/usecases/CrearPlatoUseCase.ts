import type { MenuItem } from '@/core/interfaces/MenuItem'
import type { PlatoRepository } from '@/data/repositories/PlatoRepository'

export class CrearPlatoUseCase {
  constructor(private readonly repository: PlatoRepository) {}

  async execute(uid: string, plato: MenuItem): Promise<void> {
    return await this.repository.guardarPlato(uid, plato)
  }
}
