import type { MenuItem } from "../interfaces/MenuItem";

export interface PlatoRepository {
  importarDesdeExcel(file: File): Promise<MenuItem[]>;
}
