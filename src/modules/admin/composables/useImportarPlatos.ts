import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { MenuItem } from '@/core/entities/MenuItem';

// Importa las clases, pero NO crees instancias aquí
import { ImportarPlatosUseCase } from '@/core/usecases/dish/ImportarPlatosUseCase';
import { ExcelPlatoImporter } from '@/data/importers/ExcelPlatoRepository';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';

export function useImportarPlatos() {
  // El store se obtiene aquí, dentro de la función setup del composable
  const auth = useAuthStore();

  // Estados reactivos
  const error = ref('');
  const success = ref('');
  const loading = ref(false);

  /**
   * Importa platos desde un archivo Excel.
   * Toda la lógica de creación de instancias se mueve aquí dentro.
   */
  const importar = async (file: File): Promise<Omit<MenuItem, "id">[]> => {
    // 1. Obtener el UID del usuario actual. Fallar rápido si no existe.
    const uid = auth.user?.uid;
    if (!uid) {
      const authError = 'Usuario no autenticado. No se puede realizar la importación.';
      error.value = authError;
      throw new Error(authError);
    }

    // Resetear estados
    loading.value = true;
    error.value = '';
    success.value = '';

    try {
      // 2. Crear las instancias AHORA, cuando es seguro y tenemos el UID.
      const platoRepository = new FirebaseMenuRepository(uid);
      const excelImporter = new ExcelPlatoImporter();

      // 3. Crear la instancia del caso de uso con los 3 argumentos correctos.
      const useCase = new ImportarPlatosUseCase(
        uid,
        excelImporter,
        platoRepository
      );

      // 4. Ejecutar el caso de uso. Ahora la firma es simple (solo el archivo).
      const data = await useCase.execute(file);

      if (data && data.length > 0) {
        success.value = `¡${data.length} platos importados correctamente!`;
      } else {
        success.value = 'Archivo procesado, pero no se encontraron platos para importar.';
      }
      return data || [];

    } catch (err) {
      console.error("Error detallado durante la importación (composable):", err);
      error.value = (err instanceof Error) ? err.message : 'Error desconocido al importar.';
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Exportar la función y los estados
  return {
    importar,
    loading,
    error,
    success
  };
}
