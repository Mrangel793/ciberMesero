import { ref } from 'vue';
import { ImportarPlatosUseCase } from '@/core/usecases/dish/ImportarPlatosUseCase';
import { ExcelPlatoImporter } from '@/data/importers/ExcelPlatoRepository';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
import { useAuthStore } from '@/stores/auth';
import type { MenuItem } from '@/core/entities/MenuItem';


const platoRepository = new FirebaseMenuRepository();
const excelImporter = new ExcelPlatoImporter();

const useCase = new ImportarPlatosUseCase(
  excelImporter,
  platoRepository
);

export function useImportarPlatos() {
  const auth = useAuthStore();
  const error = ref('');
  const success = ref('');
  const loading = ref(false);


  const importar = async (file: File): Promise<Omit<MenuItem, "id">[]> => {
    const uid = auth.user?.uid;
    if (!uid) {
      const authError = 'Usuario no autenticado';
      error.value = authError;
      throw new Error(authError);
    }

    loading.value = true;
    error.value = '';
    success.value = '';

    try {
      const data = await useCase.execute(file, uid);
      if (data && data.length > 0) {
        success.value = `¡${data.length} platos importados correctamente!`;
      } else if (data) {
        success.value = 'Archivo procesado, pero no se encontraron platos para importar. Revisa el contenido del archivo y las cabeceras.';
      } else {
        error.value = 'La importación no devolvió datos válidos.';
      }
      return data || []; // Devuelve data o un array vacío si data es null/undefined
    } catch (err) {
      console.error("Error detallado durante la importación (composable):", err); // <--- MUESTRA EL ERROR REAL
      error.value = (err instanceof Error) ? err.message : 'Error desconocido al importar el archivo. Revisa la consola para más detalles.';
      return [];
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
