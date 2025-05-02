import type { MenuItem } from "@/core/interfaces/MenuItem";
import type { RawMenuItem } from "@/core/interfaces/RawMenuItem";
import type { PlatoRepository } from "@/core/usecases/PlatoRepository";
import * as XLSX from 'xlsx';



export class ExcelPlatoRepository implements PlatoRepository {

  async importarDesdeExcel(file: File): Promise<MenuItem[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<RawMenuItem>(sheet, { defval: '' });


    // Mapea cada fila a un objeto Plato
    const platos: MenuItem[] = json.map((row) => {
      return {
        id: row.id || row.ID || Math.random().toString(36).substring(2, 10),
        name: row.nombre || row.Nombre || 'Sin nombre',
        description: String(row.descripcion || row.Descripción || '')
          .split('\n')
          .map(line => line.trim()),
        price: Number(row.precio || row.Precio || 0),
        oldPrice: row.oldPrice || row.PrecioAnterior || undefined,
        image: row.image || row.Imagen || '',
        onPromo: (row.onPromo || row.EnPromocion || false) === true || (row.onPromo || row.EnPromocion) === 'TRUE',
        category: row.category || row.Categoría || 'Sin categoría'
      };
    });

    return platos;
  }
}
