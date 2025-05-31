// src/modules/admin/composables/useDishManagement.ts (o similar)
import { ref } from 'vue';
import type { MenuItem } from '@/core/entities/MenuItem';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
import { getStorage, ref as storageRefFS, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ExcelPlatoImporter } from '@/data/importers/ExcelPlatoRepository';

// Importa los Use Cases
import { CrearPlatoUseCase } from '@/core/usecases/dish/CrearPlatoUseCase';
import { ObtenerPlatosUseCase } from '@/core/usecases/dish/ObtenerPlatosUseCase';
import { ImportarPlatosUseCase } from '@/core/usecases/dish/ImportarPlatosUseCase';
import { UpdatePlatoUseCase } from '@/core/usecases/dish/UpdatePlatoUseCase';
import { GetPlatoByIdUseCase } from '@/core/usecases/dish/GetPlatoByIdUseCase';
import { DeletePlatoUseCase } from '@/core/usecases/dish/DeletePlatoUseCase';

// import { DeleteVariosPlatosUseCase } from '@/core/usecases/dish/DeleteVariosPlatosUseCase'; // Si lo implementas

// Instancias
const platoRepository = new FirebaseMenuRepository();
const platoExcelImporter = new ExcelPlatoImporter(); // O como se llame tu implementación

const crearPlatoUseCase = new CrearPlatoUseCase(platoRepository);
const obtenerPlatosUseCase = new ObtenerPlatosUseCase(platoRepository);
const importarPlatosUseCase = new ImportarPlatosUseCase(platoExcelImporter, platoRepository);
const updatePlatoUseCase = new UpdatePlatoUseCase(platoRepository);
const getPlatoByIdUseCase = new GetPlatoByIdUseCase(platoRepository);
const deletePlatoUseCase = new DeletePlatoUseCase(platoRepository);
const storage = getStorage();
// const deleteVariosPlatosUseCase = new DeleteVariosPlatosUseCase(platoRepository);

export function useDishManagement() {
  const dishes = ref<MenuItem[]>([]);
  const currentDish = ref<MenuItem | null>(null);
  const loading = ref(false);
  const error = ref<Error | string | null>(null);



  const fetchAllDishes = async (uidRestaurante: string) => {
    if (!uidRestaurante) {
      error.value = "UID del restaurante no proporcionado.";
      dishes.value = [];
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      dishes.value = await obtenerPlatosUseCase.execute(uidRestaurante);
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      dishes.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchDishById = async (uidRestaurante: string, platoId: string) => {
    if (!uidRestaurante || !platoId) {
      error.value = "UID del restaurante o ID del plato no proporcionado.";
      currentDish.value = null;
      return null;
    }
    loading.value = true;
    error.value = null;
    try {
      currentDish.value = await getPlatoByIdUseCase.execute(uidRestaurante, platoId);
      return currentDish.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      currentDish.value = null;
    } finally {
      loading.value = false;
    }
    return null;
  };


  const createDish = async (
    uidRestaurante: string,
    dishData: Omit<MenuItem, 'id'>,
    archivoImagen?: File | null
  ): Promise<string> => {
    if (!uidRestaurante) throw new Error("UID del restaurante no proporcionado.");
    loading.value = true;
    error.value = null;
    const datosParaUseCase = { ...dishData }; // Copia para modificar imageUrl

    try {
      console.log("Composable createDish: Recibido dishData:", dishData, "Archivo:", archivoImagen);

      if (archivoImagen) {
        console.log("Subiendo imagen:", archivoImagen.name);
        const imagePath = `platos_imagenes/${uidRestaurante}/${Date.now()}_${archivoImagen.name}`;
        const imageRef = storageRefFS(storage, imagePath);
        const uploadResult = await uploadBytes(imageRef, archivoImagen);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        datosParaUseCase.imageUrl = downloadURL; // Actualiza imageUrl en la copia
        console.log("Imagen subida, URL:", downloadURL);
      } else {
        datosParaUseCase.imageUrl = dishData.imageUrl;
      }


      const newGeneratedId = await crearPlatoUseCase.execute(uidRestaurante, datosParaUseCase);

      console.log("Composable createDish: Nuevo ID generado:", newGeneratedId);
      await fetchAllDishes(uidRestaurante);
      return newGeneratedId;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      console.error("Composable createDish: Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const importDishesFromExcel = async (uidRestaurante: string, file: File) => {
    if (!uidRestaurante) throw new Error("UID del restaurante no proporcionado.");
    loading.value = true;
    error.value = null;
    try {
      const imported = await importarPlatosUseCase.execute(file, uidRestaurante);
      await fetchAllDishes(uidRestaurante);
      return imported;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateDish = async (uidRestaurante: string, platoId: string, dishData: Partial<Omit<MenuItem, 'id'>>) => {
    if (!uidRestaurante || !platoId) throw new Error("UID del restaurante o ID del plato no proporcionado.");
    loading.value = true;
    error.value = null;
    try {
      await updatePlatoUseCase.execute(uidRestaurante, platoId, dishData);
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeDish = async (uidRestaurante: string, platoId: string) => {
    if (!uidRestaurante || !platoId) throw new Error("UID del restaurante o ID del plato no proporcionado.");
    loading.value = true;
    error.value = null;
    try {
      await deletePlatoUseCase.execute(uidRestaurante, platoId);
      await fetchAllDishes(uidRestaurante);
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // const removeMultipleDishes = async (uidRestaurante: string, platoIds: string[]) => {
  //   // ... implementación similar usando deleteVariosPlatosUseCase
  // };

  return {
    dishes,
    currentDish,
    loading,
    error,
    fetchAllDishes,
    fetchDishById,
    createDish,
    importDishesFromExcel,
    updateDish,
    removeDish,
    // removeMultipleDishes,
  };
}
