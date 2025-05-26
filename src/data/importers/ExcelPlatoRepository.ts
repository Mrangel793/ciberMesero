// src/data/importers/ExcelPlatoImporter.ts
import type { PlatoExcelImporter } from '@/core/repositories/PlatoExcelImporter';
import type { MenuItem } from '@/core/entities/MenuItem';
import * as XLSX from 'xlsx'; // Para SheetJS

export class ExcelPlatoImporter implements PlatoExcelImporter {
  async importarDesdeExcel(file: File): Promise<Omit<MenuItem, 'id'>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            throw new Error("No se pudo leer el archivo.");
          }
          const workbook = XLSX.read(data, { type: 'binary' }); // o 'array' si prefieres
          const sheetName = workbook.SheetNames[0]; // Asume la primera hoja
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]; // Convierte a array de arrays

          if (jsonData.length < 2) { // Necesita al menos cabecera y una fila de datos
            resolve([]);
            return;
          }

          const headers = jsonData[0].map(header => String(header).trim().toLowerCase());
          const platos: Omit<MenuItem, 'id'>[] = [];

          // Mapea los nombres de las columnas esperadas a los índices
          const nameIndex = headers.indexOf('nombre');
          const descriptionIndex = headers.indexOf('descripcion');
          const priceIndex = headers.indexOf('precio');
          const categoryIndex = headers.indexOf('categoria');
          const imageUrlIndex = headers.indexOf('imagenurl'); // O 'imagen'

          if (nameIndex === -1 || priceIndex === -1 || categoryIndex === -1) {
            throw new Error("El archivo Excel no tiene las columnas requeridas (nombre, precio, categoria).");
          }

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const price = parseFloat(String(row[priceIndex]));

            if (!row[nameIndex] || isNaN(price) || !row[categoryIndex]) {
              console.warn(`Fila ${i+1} ignorada por datos faltantes o precio inválido.`);
              continue;
            }

            const plato: Omit<MenuItem, 'id'> = {
              name: String(row[nameIndex]).trim(),
              description: descriptionIndex !== -1 && row[descriptionIndex] ? String(row[descriptionIndex]).trim() : undefined,
              price: price,
              category: String(row[categoryIndex]).trim(),
              imageUrl: imageUrlIndex !== -1 && row[imageUrlIndex] ? String(row[imageUrlIndex]).trim() : undefined,
            };
            platos.push(plato);
          }
          resolve(platos);
        } catch (error) {
          console.error("Error procesando el archivo Excel:", error);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error("Error leyendo el archivo:", error);
        reject(error);
      };

      reader.readAsBinaryString(file); // o readAsArrayBuffer(file)
    });
  }
}
