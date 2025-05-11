import { ref } from 'vue'
import type { TeamMember } from '@/core/entities/TeamMember';
import { CrearEmpleadoUseCase } from '@/core/usecases/CrearEmpleadoUseCase';
import { FirebaseTeamRepository } from '@/data/repositories/FirebaseTeamRepository';

export function useCrearEmpleado() {
  const loading = ref(false)
  const error = ref<null | string>(null)

  const crearEmpleado = async (empleado: TeamMember) => {
    loading.value = true
    error.value = null

    const useCase = new CrearEmpleadoUseCase(new FirebaseTeamRepository())

    try {
      await useCase.execute(empleado)
    } catch (err) {
      error.value = 'Error al crear el empleado'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    crearEmpleado,
    loading,
    error
  }
}
