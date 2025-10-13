// src/modules/admin/composables/usePromotionManagement.ts
import { ref } from 'vue';
import type { Promotion } from '@/core/entities/Promotion';
import { FirebasePromotionRepository } from '@/data/repositories/FirebasePromotionRepository';

// Importa los Use Cases
import { CreatePromotionUseCase } from '@/core/usecases/promotion/CreatePromotionUseCase';
import { GetAllPromotionsUseCase } from '@/core/usecases/promotion/GetAllPromotionsUseCase';
import { GetPromotionByIdUseCase } from '@/core/usecases/promotion/GetPromotionByIdUseCase';
import { UpdatePromotionUseCase } from '@/core/usecases/promotion/UpdatePromotionUseCase';
import { DeletePromotionUseCase } from '@/core/usecases/promotion/DeletePromotionUseCase';
import type { GetAllPromotionsInput } from '@/core/usecases/promotion/GetAllPromotionsUseCase';
import type { CreatePromotionInput } from '@/core/usecases/promotion/CreatePromotionUseCase';
import { useAuthStore } from '@/stores/auth';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
export function usePromotionManagement() {
  const authStore = useAuthStore();
  const promotions = ref<Promotion[]>([]);
  const currentPromotion = ref<Promotion | null>(null);
  const loading = ref(false);
  const error = ref<Error | string | null>(null);

  /**
   * Función auxiliar para obtener instancias de los casos de uso con el UID del usuario actual.
   * Esto asegura que el repositorio siempre opere sobre los datos del restaurante correcto.
   */
  const getUseCases = () => {
    const uid = authStore.user?.uid;
    if (!uid) {
      throw new Error("Usuario no autenticado. No se pueden realizar operaciones de promociones.");
    }

    const promotionRepository = new FirebasePromotionRepository(uid);
    const dishRepository = new FirebaseMenuRepository(uid);

    return {
      createPromotionUseCase: new CreatePromotionUseCase(promotionRepository, dishRepository),
      getAllPromotionsUseCase: new GetAllPromotionsUseCase(promotionRepository),
      getPromotionByIdUseCase: new GetPromotionByIdUseCase(promotionRepository),
      updatePromotionUseCase: new UpdatePromotionUseCase(promotionRepository, dishRepository),
      deletePromotionUseCase: new DeletePromotionUseCase(promotionRepository),
    };
  };

  const fetchAllPromotions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { getAllPromotionsUseCase } = getUseCases();
      promotions.value = await getAllPromotionsUseCase.execute();
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      promotions.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchPromotionById = async (promotionId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { getPromotionByIdUseCase } = getUseCases();
      currentPromotion.value = await getPromotionByIdUseCase.execute(promotionId);
      return currentPromotion.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      loading.value = false;
    }
    return null;
  };

  const createPromotion = async (
    promotionInputData: CreatePromotionInput,
    restaurantId?: string,
    imageFile?: File | null
  ): Promise<string> => {
    loading.value = true;
    error.value = null;

    try {
      const { createPromotionUseCase } = getUseCases();
      // Pasamos tanto los datos como el archivo de imagen al caso de uso
      const newId = await createPromotionUseCase.execute(promotionInputData, imageFile);
      return newId;
    } catch (err) {
      console.error("[usePromotionManagement] Error en createPromotion:", err);
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePromotion = async (
    promotionId: string,
    promotionData: Partial<Omit<Promotion, 'id'>>,
    restaurantId?: string,
    imageFile?: File | null
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const { updatePromotionUseCase } = getUseCases();
      await updatePromotionUseCase.execute(promotionId, promotionData, imageFile);
      // await fetchAllPromotions(); // O el componente padre refresca
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removePromotion = async (promotionId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { deletePromotionUseCase } = getUseCases();
      await deletePromotionUseCase.execute(promotionId);
      // await fetchAllPromotions(); // O el componente padre refresca
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    promotions,
    currentPromotion,
    loading,
    error,
    fetchAllPromotions,
    fetchPromotionById,
    createPromotion,
    updatePromotion,
    removePromotion,
  };
}
