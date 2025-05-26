import { ref } from 'vue'
import { ImportarPlatosUseCase } from '@/core/usecases/dish/ImportarPlatosUseCase';
import { ExcelPlatoImporter } from '@/data/importers/ExcelPlatoRepository';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
import { useAuthStore } from '@/stores/auth';
import type { MenuItem } from '@/core/entities/MenuItem';


const useCase = new ImportarPlatosUseCase(
  new ExcelPlatoImporter(),
  new FirebaseMenuRepository()
)

export function useImportarPlatos() {
  const auth = useAuthStore();
  const error = ref('');
  const success = ref('');

  const importar = async (file: File): Promise<MenuItem[]> => {
    const uid = auth.user?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    try {
      error.value = ''
      const data = await useCase.execute(file, uid)
      success.value = '¡Menú importado correctamente!'
      if (!data || data.length === 0) {
        error.value = 'El archivo no contiene datos válidos'
        return []
      }
      const menuItems: MenuItem[] = data.map((item: any) => ({
        ...item,
        id: item.id ?? '', // Provide a default or generate an id as needed
      }))
      return menuItems
    } catch {
      error.value = 'Error al importar el archivo'
      return []
    }
  }

  return {
    importar,
    error,
    success
  }
}
