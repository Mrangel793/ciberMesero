import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
import { ObtenerPlatosUseCase } from '@/core/usecases/ObtenerPlatosUseCase';
import type { MenuItem } from '@/core/entities/MenuItem';

const useCase = new ObtenerPlatosUseCase(new FirebaseMenuRepository());

export function useObtenerPlatos() {
  const platos = ref<MenuItem[]>([]);
  const loading = ref(false);
  const error = ref('');
  const auth = useAuthStore();

  const cargarPlatos = async () => {
    try {
      loading.value = true;
      error.value = '';
      if (!auth.user?.uid) throw new Error('Usuario no autenticado');
      platos.value = await useCase.execute(auth.user.uid);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    platos,
    loading,
    error,
    cargarPlatos,
  };
}
