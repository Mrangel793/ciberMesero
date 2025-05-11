import type { MenuItem } from '@/core/entities/MenuItem'

export interface PlatoExcelImporter {
  importarDesdeExcel(file: File): Promise<MenuItem[]>
}
