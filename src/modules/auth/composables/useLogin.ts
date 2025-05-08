import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { FirebaseAuthRepository } from '@/data/repositories/FirebaseAuthRepository'
import { LoginUseCase } from '@/core/usecases/LoginUseCase'

const loginUseCase = new LoginUseCase(new FirebaseAuthRepository())

export const useLogin = () => {
  const errorMessage = ref('')
  const successMessage = ref('')
  const router = useRouter()
  const authStore = useAuthStore()

  const login = async (email: string, password: string) => {
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const user = await loginUseCase.execute(email, password)
      authStore.login(user)

      successMessage.value = '¡Inicio de sesión exitoso!'

      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard')
            break
          case 'cliente':
            router.push('/cliente/home')
            break
          case 'superadmin':
            router.push('/superadmin/panel')
            break
          case 'cocina':
            router.push('/cocina/pedidos')
            break
          case 'mesero':
            router.push('/mesero/pedidos')
            break
          default:
            router.push('/home')
        }
      }, 1000)

    } catch (err: any) {
      errorMessage.value = err.message || 'Error desconocido'
    }
  }

  return {
    login,
    errorMessage,
    successMessage
  }
}
