import type { PlatoExcelImporter } from '@/data/repositories/PlatoExcelImporter'
import type { PlatoRepository } from '@/data/repositories/PlatoRepository'
import type { MenuItem } from '@/core/interfaces/MenuItem'

export class ImportarPlatosUseCase {
  constructor(
    private readonly importer: PlatoExcelImporter,
    private readonly repository: PlatoRepository
  ) {}

  async execute(file: File, uid: string): Promise<MenuItem[]> {
    const platos = await this.importer.importarDesdeExcel(file)
    await this.repository.guardarMenu(uid, platos)
    return platos
  }
}
