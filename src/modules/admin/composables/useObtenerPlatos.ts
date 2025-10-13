import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
import { ObtenerPlatosUseCase } from '@/core/usecases/dish/ObtenerPlatosUseCase';
import type { MenuItem } from '@/core/entities/MenuItem';

export function useObtenerPlatos() {
  const platos = ref<MenuItem[]>([]);
  const loading = ref(false);
  const error = ref('');
  const auth = useAuthStore();

  const cargarPlatos = async () => {
    try {
      loading.value = true;
      error.value = '';

      if (!auth.user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      // Crear el repositorio y el use case con el UID del usuario autenticado
      const repository = new FirebaseMenuRepository(auth.user.uid);
      const useCase = new ObtenerPlatosUseCase(repository);

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
