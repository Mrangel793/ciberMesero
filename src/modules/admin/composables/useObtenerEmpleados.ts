import { ref } from 'vue'
import type { TeamMember } from '@/core/entities/TeamMember'
import { FirebaseTeamRepository } from '@/data/repositories/FirebaseTeamRepository'
import { ObtenerEmpleadosUseCase } from '@/core/usecases/ObtenerEmpleadosUseCase'

export function useObtenerEmpleados() {
  const empleados = ref<TeamMember[]>([])
  const loading = ref(false)
  const error = ref<null | string>(null)

  const cargarEmpleados = async () => {
    loading.value = true
    error.value = null

    const useCase = new ObtenerEmpleadosUseCase(new FirebaseTeamRepository())

    try {
      empleados.value = await useCase.execute()
    } catch (err) {
      console.error(err)
      error.value = 'Error al cargar los empleados'
    } finally {
      loading.value = false
    }
  }

  return {
    empleados,
    cargarEmpleados,
    loading,
    error
  }
}
