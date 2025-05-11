import { CrearPlatoUseCase } from '@/core/usecases/CrearPlatoUseCase'
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository'
import { useAuthStore } from '@/stores/auth'
import type { MenuItem } from '@/core/entities/MenuItem'

const useCase = new CrearPlatoUseCase(new FirebaseMenuRepository())

export function useCrearPlato() {
  const auth = useAuthStore()

  const crear = async (plato: Omit<MenuItem, 'id'>) => {
    const uid = auth.user?.uid
    if (!uid) throw new Error('Usuario no autenticado')

    const newPlato: MenuItem = {
      ...plato,
      id: Date.now()
    }

    await useCase.execute(uid, newPlato)
    return newPlato
  }

  return { crear }
}
