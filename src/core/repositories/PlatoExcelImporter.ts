import type { RawMenuItemData } from '../entities/RawMenuItemData';

export interface PlatoExcelImporter {
  importarDesdeExcel(file: File): Promise<RawMenuItemData[]>;
}
