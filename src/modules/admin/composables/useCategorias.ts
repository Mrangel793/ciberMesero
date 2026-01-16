import { ref, onMounted } from 'vue';
import { ObtenerCategoriasUseCase } from '@/core/usecases/category/ObtenerCategoriasUseCase';
import { FirebaseCategoriaRepository } from '@/data/repositories/FirebaseCategoriaRepository';
import type { Category } from '@/core/entities/Category';
import { useAuthStore } from '@/stores/auth';

const repo = new FirebaseCategoriaRepository();
const useCase = new ObtenerCategoriasUseCase(repo);

export const useCategorias = () => {
  const categorias = ref<Category[]>([]);
  const cargando = ref(true);
  const error = ref('');
  const auth = useAuthStore();

  const cargarCategorias = async () => {
    try {
      cargando.value = true
      error.value = ''
      categorias.value = await useCase.execute(auth.user!.uid)
    } catch (e) {
      error.value = 'Error cargando categorías'
      console.error(e)
    } finally {
      cargando.value = false
    }
  }

  onMounted(cargarCategorias)

  return {
    categorias,
    cargando,
    error,
    cargarCategorias
  }
}
