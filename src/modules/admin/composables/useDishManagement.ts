import { ref } from 'vue';
import type { MenuItem } from '@/core/entities/MenuItem';
import { useAuthStore } from '@/stores/auth';

// Repositorios e Importers
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
import { ExcelPlatoImporter } from '@/data/importers/ExcelPlatoRepository';

// Casos de Uso
import { CrearPlatoUseCase } from '@/core/usecases/dish/CrearPlatoUseCase';
import { ObtenerPlatosUseCase } from '@/core/usecases/dish/ObtenerPlatosUseCase';
import { GetPlatoByIdUseCase } from '@/core/usecases/dish/GetPlatoByIdUseCase';
import { UpdatePlatoUseCase } from '@/core/usecases/dish/UpdatePlatoUseCase';
import { DeletePlatoUseCase } from '@/core/usecases/dish/DeletePlatoUseCase';
import { ImportarPlatosUseCase } from '@/core/usecases/dish/ImportarPlatosUseCase';


export function useDishManagement() {
  const authStore = useAuthStore();

  // Estados reactivos
  const dishes = ref<MenuItem[]>([]);
  const currentDish = ref<MenuItem | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Función auxiliar para obtener instancias de los casos de uso con el UID del usuario actual.
   * Esto asegura que el repositorio siempre opere sobre los datos del restaurante correcto.
   */
  const getUseCases = () => {
    const uid = authStore.user?.uid;
    if (!uid) {
      // Lanzar un error aquí es una buena práctica para fallar rápido.
      throw new Error("Usuario no autenticado. No se pueden realizar operaciones de platos.");
    }

    const platoRepository = new FirebaseMenuRepository(uid);
    const platoExcelImporter = new ExcelPlatoImporter(); // Asumiendo que no necesita UID

    return {
      crearPlatoUseCase: new CrearPlatoUseCase(platoRepository),
      obtenerPlatosUseCase: new ObtenerPlatosUseCase(platoRepository),
      getPlatoByIdUseCase: new GetPlatoByIdUseCase(platoRepository),
      updatePlatoUseCase: new UpdatePlatoUseCase(platoRepository),
      deletePlatoUseCase: new DeletePlatoUseCase(platoRepository),
      importarPlatosUseCase: new ImportarPlatosUseCase(uid, platoExcelImporter, platoRepository),
    };
  };

  /**
   * Obtiene todos los platos del menú del restaurante actual.
   */
  const fetchAllDishes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { obtenerPlatosUseCase } = getUseCases();
      dishes.value = await obtenerPlatosUseCase.execute();
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      dishes.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtiene un plato específico por su ID.
   */
  const fetchDishById = async (platoId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { getPlatoByIdUseCase } = getUseCases();
      currentDish.value = await getPlatoByIdUseCase.execute(platoId);
      return currentDish.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      currentDish.value = null;
    } finally {
      loading.value = false;
    }
    return null;
  };

  /**
   * Crea un nuevo plato en el menú.
   */
  const createDish = async (platoData: Omit<MenuItem, 'id'>, imageFile: File | null = null): Promise<string> => {
    loading.value = true;
    error.value = null;
    try {
      // La lógica de subir la imagen se delega al repositorio, que ya está preparado para ello.
      // Aquí, simplemente pasamos los datos y el archivo.
      const { crearPlatoUseCase, updatePlatoUseCase } = getUseCases(); // Necesitamos update para la imagen

      // Primero creamos el plato sin imagen para obtener su ID
      const newDishId = await crearPlatoUseCase.execute({ ...platoData, imageUrl: '' });

      // Si hay una imagen, la subimos usando el método de actualización
      if (imageFile) {
        await updatePlatoUseCase.execute(newDishId, {}, imageFile);
      }

      await fetchAllDishes(); // Refresca la lista
      return newDishId;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualiza un plato existente.
   */
  const updateDish = async (platoId: string, platoData: Partial<Omit<MenuItem, 'id'>>, imageFile: File | null) => {
    loading.value = true;
    error.value = null;
    try {
      const { updatePlatoUseCase } = getUseCases();
      await updatePlatoUseCase.execute(platoId, platoData, imageFile);
      await fetchAllDishes(); // Refresca la lista
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Elimina un plato del menú.
   */
  const deleteDish = async (platoId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { deletePlatoUseCase } = getUseCases();
      await deletePlatoUseCase.execute(platoId);
      await fetchAllDishes(); // Refresca la lista
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Importa platos desde un archivo Excel.
   */
  const importDishesFromExcel = async (file: File) => {
    loading.value = true;
    error.value = null;
    try {
      const { importarPlatosUseCase } = getUseCases();
      await importarPlatosUseCase.execute(file); // La implementación del caso de uso se encarga del UID si es necesario.
      await fetchAllDishes();
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Funciones exportadas por el composable
  return {
    dishes,
    currentDish,
    loading,
    error,
    fetchAllDishes,
    fetchDishById,
    createDish,
    updateDish,
    deleteDish,
    importDishesFromExcel,
  };
}
