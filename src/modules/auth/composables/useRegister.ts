import { ref } from 'vue';
import { useRouter } from 'vue-router'
import type { User } from '@/core/entities/User'
import { FirebaseUserRepository } from '@/data/repositories/FirebaseUserRepository';
import { RegisterUseCase } from '@/core/usecases/auth/RegisterUseCase';


const registerUseCase = new RegisterUseCase(new FirebaseUserRepository());

export const useRegister = () => {
  const errorMessage = ref('')
  const successMessage = ref('')
  const router = useRouter()

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
    plan?: string
  ) => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!name || !email || !password) {
      errorMessage.value = 'Por favor, completa todos los campos.'
      return
    }

    if (password.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
      return
    }

    const userData: Omit<User, 'uid' | 'createdAt'> = {
      name,
      email,
      role,
      restaurantInfo: role === 'admin'
        ? {
            plan: plan || 'basico',
            pruebaActiva: true,
            estadoPlan: 'activo',
            fechaInicio: new Date()
          }
        : undefined,
      clientInfo: role !== 'admin'
        ? {
            preferencias: [],
            favoritos: []
          }
        : undefined
    }

    try {
      await registerUseCase.execute(userData, password)

      successMessage.value = '¡Registro exitoso! Revisa tu correo y luego inicia sesión.'

      setTimeout(() => {
        router.push({ name: 'Login' })
      }, 2000)

    } catch (error: any) {
      errorMessage.value = 'Error al registrar: ' + error.message
    }
  }

  return {
    register,
    errorMessage,
    successMessage
  }
}
