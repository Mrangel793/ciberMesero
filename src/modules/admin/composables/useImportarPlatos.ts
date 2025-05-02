import { ref } from 'vue'
import { ImportarPlatosUseCase } from '@/core/usecases/ImportarPlatosUseCase'
import { ExcelPlatoRepository } from '@/data/repositories/ExcelPlatoRepository'
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository'
import { useAuthStore } from '@/stores/auth'
import type { MenuItem } from '@/core/interfaces/MenuItem'

const useCase = new ImportarPlatosUseCase(
  new ExcelPlatoRepository(),
  new FirebaseMenuRepository()
)

export function useImportarPlatos() {
  const auth = useAuthStore()
  const error = ref('')
  const success = ref('')

  const importar = async (file: File): Promise<MenuItem[]> => {
    const uid = auth.user?.uid
    if (!uid) throw new Error('Usuario no autenticado')

    try {
      error.value = ''
      const data = await useCase.execute(file, uid)
      success.value = '¡Menú importado correctamente!'
      return data
    } catch (e) {
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
