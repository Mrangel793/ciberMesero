// src/data/importers/ExcelPlatoImporter.ts
import type { PlatoExcelImporter } from '@/core/repositories/PlatoExcelImporter';
import type { MenuItem } from '@/core/entities/MenuItem';
import * as XLSX from 'xlsx';

export class ExcelPlatoImporter implements PlatoExcelImporter {
  async importarDesdeExcel(file: File): Promise<Omit<MenuItem, 'id'>[]> {
    console.log("[ExcelPlatoImporter] Iniciando importación del archivo:", file.name); // Log inicial
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          console.log("[ExcelPlatoImporter] Archivo leído, procesando...");
          const data = event.target?.result;
          if (!data) {
            console.error("[ExcelPlatoImporter] Error: No se pudo obtener data del archivo.");
            throw new Error("No se pudo leer el archivo.");
          }
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }) as any[][]; // blankrows: false para omitir filas vacías

          console.log("[ExcelPlatoImporter] jsonData (primeras 5 filas):", JSON.stringify(jsonData.slice(0, 5)));


          if (jsonData.length < 2) {
            console.warn("[ExcelPlatoImporter] El archivo no tiene suficientes filas (cabecera + datos).");
            resolve([]); // Resuelve con array vacío si no hay datos
            return;
          }

          const headers = jsonData[0].map(header => String(header).trim().toLowerCase());
          console.log("[ExcelPlatoImporter] Cabeceras procesadas (minúsculas):", headers);
          const platos: Omit<MenuItem, 'id'>[] = [];

          const nameIndex = headers.indexOf('nombre');
          const descriptionIndex = headers.indexOf('descripcion');
          const priceIndex = headers.indexOf('precio');
          const oldPriceIndex = headers.indexOf('precioanterior');
          const categoryIndex = headers.indexOf('categoria');
          const imageUrlIndex = headers.indexOf('imagenurl');
          const onPromoIndex = headers.indexOf('enpromocion');

          console.log("[ExcelPlatoImporter] Índices encontrados:", { nameIndex, descriptionIndex, priceIndex, oldPriceIndex, categoryIndex, imageUrlIndex, onPromoIndex });

          if (nameIndex === -1 || priceIndex === -1 || categoryIndex === -1) {
            const missingCols = [];
            if (nameIndex === -1) missingCols.push("'nombre'");
            if (priceIndex === -1) missingCols.push("'precio'");
            if (categoryIndex === -1) missingCols.push("'categoria'");
            const errorMsg = `El archivo Excel no tiene las columnas requeridas: ${missingCols.join(', ')}. Cabeceras encontradas: ${headers.join(', ')}`;
            console.error("[ExcelPlatoImporter]", errorMsg);
            throw new Error(errorMsg);
          }

          console.log(`[ExcelPlatoImporter] Procesando ${jsonData.length - 1} filas de datos.`);
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            // Omitir filas completamente vacías que puedan quedar después de blankrows: false
            if (row.every(cell => cell === null || String(cell).trim() === '')) {
                console.warn(`[ExcelPlatoImporter] Fila ${i + 1} completamente vacía, ignorada.`);
                continue;
            }

            // Asegurarse que la celda existe antes de intentar leerla
            const nombreCrudo = row[nameIndex];
            const precioCrudo = row[priceIndex];
            const categoriaCruda = row[categoryIndex];

            // Validar que las celdas de columnas requeridas no sean undefined
            if (nombreCrudo === undefined || precioCrudo === undefined || categoriaCruda === undefined) {
                 console.warn(`[ExcelPlatoImporter] Fila ${i + 1} ignorada por celdas requeridas undefined (Nombre: ${nombreCrudo}, Precio: ${precioCrudo}, Categoría: ${categoriaCruda}).`);
                 continue;
            }

            const price = parseFloat(String(precioCrudo));

            if (String(nombreCrudo).trim() === '' || isNaN(price) || String(categoriaCruda).trim() === '') {
              console.warn(`[ExcelPlatoImporter] Fila ${i + 1} ignorada por datos faltantes o precio inválido (Nombre: ${nombreCrudo}, Precio: ${precioCrudo}, Categoría: ${categoriaCruda}).`);
              continue;
            }

            let onPromoValue = false;
            if (onPromoIndex !== -1 && row[onPromoIndex] !== undefined && String(row[onPromoIndex]).trim() !== '') {
              const cellValue = String(row[onPromoIndex]).trim().toLowerCase();
              onPromoValue = ['true', '1', 'si', 'yes', 'verdadero'].includes(cellValue);
            }

            let oldPriceValue: number | undefined = undefined;
            if (oldPriceIndex !== -1 && row[oldPriceIndex] !== undefined && String(row[oldPriceIndex]).trim() !== '') {
              const parsedOldPrice = parseFloat(String(row[oldPriceIndex]));
              if (!isNaN(parsedOldPrice)) {
                oldPriceValue = parsedOldPrice;
              }
            }

            const plato: Omit<MenuItem, 'id'> = {
              name: String(nombreCrudo).trim(),
              description: (descriptionIndex !== -1 && row[descriptionIndex] !== undefined) ? String(row[descriptionIndex]).trim() : undefined,
              price: price,
              category: String(categoriaCruda).trim(),
              imageUrl: (imageUrlIndex !== -1 && row[imageUrlIndex] !== undefined) ? String(row[imageUrlIndex]).trim() : undefined,
              onPromo: onPromoValue,
              oldPrice: oldPriceValue !== undefined ? String(oldPriceValue) : undefined,
            };
            // console.log(`[ExcelPlatoImporter] Plato procesado de fila ${i + 1}:`, plato); // Descomentar para mucho detalle
            platos.push(plato);
          }
          console.log(`[ExcelPlatoImporter] Finalizado. Platos procesados: ${platos.length}`);
          resolve(platos);
        } catch (error) {
          // Este console.error ya estaba, pero el `reject` es importante
          console.error("[ExcelPlatoImporter] Error interno procesando el archivo Excel:", error);
          reject(error); // Asegúrate de que la promesa se rechace con el error
        }
      };

      reader.onerror = (error) => {
        console.error("[ExcelPlatoImporter] Error leyendo el archivo (FileReader.onerror):", error);
        reject(error); // Asegúrate de que la promesa se rechace
      };

      reader.readAsBinaryString(file);
    });
  }
}
