
import { ref } from 'vue';
import { CrearCategoriaUseCase } from '@/core/usecases/category/CrearCategoriaUseCase';
import { FirebaseCategoriaRepository } from '@/data/repositories/FirebaseCategoriaRepository';
import { useAuthStore } from '@/stores/auth';

const categoriaRepo = new FirebaseCategoriaRepository();
const crearCategoriaUC = new CrearCategoriaUseCase(categoriaRepo);

export const useCrearCategoria = () => {
  const error = ref('');
  const success = ref('');
  const authStore = useAuthStore();

  const crearCategoria = async (nombre: string) => {
    error.value = '';
    try {
      if (!authStore.user?.uid) throw new Error('No hay usuario autenticado');
      await crearCategoriaUC.ejecutar(authStore.user.uid, nombre);
      success.value = '¡Categoría creada exitosamente!';
    } catch (e: any) {
      error.value = e.message || 'Error al crear la categoría';
    }
  }

  return {
    crearCategoria,
    error,
    success,
  }
}
