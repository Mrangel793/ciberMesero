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
// Instancias
const promotionRepository = new FirebasePromotionRepository();

const createPromotionUseCase = new CreatePromotionUseCase(promotionRepository);
const getAllPromotionsUseCase = new GetAllPromotionsUseCase(promotionRepository);
const getPromotionByIdUseCase = new GetPromotionByIdUseCase(promotionRepository);
const updatePromotionUseCase = new UpdatePromotionUseCase(promotionRepository);
const deletePromotionUseCase = new DeletePromotionUseCase(promotionRepository);

export function usePromotionManagement() {
  const promotions = ref<Promotion[]>([]);
  const currentPromotion = ref<Promotion | null>(null);
  const loading = ref(false);
  const error = ref<Error | string | null>(null);

  const fetchAllPromotions = async (options?: GetAllPromotionsInput) => {
    loading.value = true;
    error.value = null;
    try {
      promotions.value = await getAllPromotionsUseCase.execute(options);
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
      currentPromotion.value = await getPromotionByIdUseCase.execute(promotionId);
      return currentPromotion.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      loading.value = false;
    }
    return null;
  };

  const createPromotion = async (uidRestaurante: string, promotionInputData: CreatePromotionInput): Promise<string> => {
    loading.value = true;
    error.value = null;
    try {
      console.log("[usePromotionManagement] Llamando a CreatePromotionUseCase con input:", promotionInputData);
      const newId = await createPromotionUseCase.execute(uidRestaurante, promotionInputData);
      return newId;
    } catch (err) {
      console.error("[usePromotionManagement] Error en createPromotion:", err);
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePromotion = async (promotionId: string, promotionData: Partial<Omit<Promotion, 'id' | 'restaurantId' | 'restaurantName'>>) => {
    loading.value = true;
    error.value = null;
    try {
      await updatePromotionUseCase.execute(promotionId, promotionData);
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
