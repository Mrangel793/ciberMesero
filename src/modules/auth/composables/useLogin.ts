import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { FirebaseAuthRepository } from '@/data/repositories/FirebaseAuthRepository';
import { useAuthStore } from '@/stores/auth';

const authRepo = new FirebaseAuthRepository();

export const useLogin = () => {
    const errorMessage = ref('');
    const successMessage = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    const login = async (email: string, password: string) => {
        errorMessage.value = '';
        successMessage.value = '';

        try {
            const user = await authRepo.login(email, password);
            authStore.login(user);

            successMessage.value = '¡Inicio de sesión exitoso!';

            setTimeout(() => {
                if (user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (user.role === 'cliente') {
                    router.push('/cliente/home');
                } else if (user.role === 'superadmin') {
                    router.push('/superadmin/panel');
                } else if (user.role === 'cocina') {
                    router.push('/cocina/pedidos');
                } else if (user.role === 'mesero') {
                    router.push('/mesero/pedidos');
                }
                else {
                    router.push('/home'); // o donde quieras redirigir a clientes
                }
            }, 1000);

        } catch (err: any) {
            errorMessage.value = err.message;
        }
    };

    return {
        login,
        errorMessage,
        successMessage
    };
};
