// Tu composable useImportarPlatos.ts
import { ref } from 'vue';
import { ImportarPlatosUseCase } from '@/core/usecases/dish/ImportarPlatosUseCase';
import { ExcelPlatoImporter } from '@/data/importers/ExcelPlatoRepository';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository'; // Asumo que este es tu repo para guardar
import { useAuthStore } from '@/stores/auth';
import type { MenuItem } from '@/core/entities/MenuItem';

// Asegúrate de que FirebaseMenuRepository implemente PlatoRepository
// y que ExcelPlatoImporter implemente PlatoExcelImporter
const platoRepository = new FirebaseMenuRepository(); // Esta instancia debe ser compatible con PlatoRepository
const excelImporter = new ExcelPlatoImporter();       // Esta instancia debe ser compatible con PlatoExcelImporter

const useCase = new ImportarPlatosUseCase(
  excelImporter,
  platoRepository
);

export function useImportarPlatos() {
  const auth = useAuthStore();
  const error = ref('');
  const success = ref('');
  const loading = ref(false); // Añadido para feedback de UI

  // Cambia la promesa para que devuelva Omit<MenuItem, "id">[] si los datos importados no tienen 'id'
  const importar = async (file: File): Promise<Omit<MenuItem, "id">[]> => {
    const uid = auth.user?.uid;
    if (!uid) {
      const authError = 'Usuario no autenticado';
      error.value = authError;
      throw new Error(authError); // Lanza el error para que el llamador pueda reaccionar si es necesario
    }

    loading.value = true;
    error.value = '';
    success.value = '';

    try {
      const data = await useCase.execute(file, uid);
      if (data && data.length > 0) {
        success.value = `¡${data.length} platos importados correctamente!`;
      } else if (data) { // data existe pero está vacío
        success.value = 'Archivo procesado, pero no se encontraron platos para importar. Revisa el contenido del archivo y las cabeceras.';
      } else { // data es undefined/null, lo cual no debería pasar si la promesa se resuelve
        error.value = 'La importación no devolvió datos válidos.';
      }
      return data || []; // Devuelve data o un array vacío si data es null/undefined
    } catch (err) { // <--- CAPTURA EL OBJETO DE ERROR
      console.error("Error detallado durante la importación (composable):", err); // <--- MUESTRA EL ERROR REAL
      // Asigna el mensaje de error del objeto de error capturado
      error.value = (err instanceof Error) ? err.message : 'Error desconocido al importar el archivo. Revisa la consola para más detalles.';
      return []; // Devuelve un array vacío en caso de error
    } finally {
      loading.value = false;
    }
  };

  return {
    importar,
    loading,
    error,
    success
  };
}
