import type { MenuItem } from '@/core/interfaces/MenuItem'

export interface PlatoExcelImporter {
  importarDesdeExcel(file: File): Promise<MenuItem[]>
}
