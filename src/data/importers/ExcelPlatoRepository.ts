// src/data/importers/ExcelPlatoImporter.ts (CÓDIGO COMPLETO Y CORRECTO)

import type { PlatoExcelImporter } from '@/core/repositories/PlatoExcelImporter';
import type { RawMenuItemData } from '@/core/entities/RawMenuItemData';
import * as XLSX from 'xlsx';

export class ExcelPlatoImporter implements PlatoExcelImporter {

  async importarDesdeExcel(file: File): Promise<RawMenuItemData[]> {
    console.log("[ExcelPlatoImporter] Iniciando importación del archivo:", file.name);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          console.log("[ExcelPlatoImporter] Archivo leído, procesando...");
          const data = event.target?.result;
          if (!data) {
            throw new Error("No se pudo leer el archivo.");
          }
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }) as any[][];

          if (jsonData.length < 2) {
            console.warn("[ExcelPlatoImporter] El archivo no tiene suficientes filas (cabecera + datos).");
            resolve([]);
            return;
          }

          const headers = jsonData[0].map(header => String(header).trim().toLowerCase());
          const platos: RawMenuItemData[] = []; // Usando el tipo correcto

          const nameIndex = headers.indexOf('nombre');
          const descriptionIndex = headers.indexOf('descripcion');
          const priceIndex = headers.indexOf('precio');
          const oldPriceIndex = headers.indexOf('precioanterior');
          const categoryIndex = headers.indexOf('categoria');
          const imageUrlIndex = headers.indexOf('imagenurl');
          const onPromoIndex = headers.indexOf('enpromocion');
          const availableIndex = headers.indexOf('disponible'); // Añadido para 'available'

          if (nameIndex === -1 || priceIndex === -1 || categoryIndex === -1) {
            throw new Error("El archivo Excel no tiene las columnas requeridas: 'nombre', 'precio', 'categoria'.");
          }

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];

            if (row.every(cell => cell === null || String(cell).trim() === '')) {
              continue; // Ignorar filas vacías
            }

            // ... (resto de tu lógica de validación de filas) ...

            const nombreCrudo = row[nameIndex];
            const precioCrudo = row[priceIndex];
            const categoriaCruda = row[categoryIndex];

            if (nombreCrudo === undefined || precioCrudo === undefined || categoriaCruda === undefined) {
              continue;
            }

            const price = parseFloat(String(precioCrudo));

            if (String(nombreCrudo).trim() === '' || isNaN(price) || String(categoriaCruda).trim() === '') {
              continue;
            }

            // Procesamiento de campos opcionales (tu lógica es buena)
            let onPromoValue = false;
            if (onPromoIndex !== -1 && row[onPromoIndex] !== undefined) {
              const cellValue = String(row[onPromoIndex]).trim().toLowerCase();
              onPromoValue = ['true', '1', 'si', 'yes', 'verdadero'].includes(cellValue);
            }

            let availableValue = true; // Por defecto disponible
            if (availableIndex !== -1 && row[availableIndex] !== undefined) {
              const cellValue = String(row[availableIndex]).trim().toLowerCase();
              availableValue = !['false', '0', 'no', 'falso'].includes(cellValue); // Se considera no disponible solo si es explícitamente falso
            }

            const descriptionArray = (descriptionIndex !== -1 && row[descriptionIndex])
              ? String(row[descriptionIndex]).split('\n').map(s => s.trim()).filter(Boolean)
              : undefined;

            const oldPriceValue = (oldPriceIndex !== -1 && row[oldPriceIndex]) ? String(row[oldPriceIndex]) : undefined;
            const imageUrlValue = (imageUrlIndex !== -1 && row[imageUrlIndex]) ? String(row[imageUrlIndex]) : undefined;

            const plato: RawMenuItemData = {
              name: String(nombreCrudo).trim(),
              description: descriptionArray,
              price: price,
              category: String(categoriaCruda).trim(),
              imageUrl: imageUrlValue,
              onPromo: onPromoValue,
              oldPrice: oldPriceValue,
              available: availableValue, // Añadido
            };
            platos.push(plato);
          }
          console.log(`[ExcelPlatoImporter] Finalizado. Platos procesados: ${platos.length}`);
          resolve(platos);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }
}
