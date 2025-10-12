<template>
    <div class="flex justify-center items-center h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">REGISTRO</h1>
        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nombre completo</label>
            <input type="text" id="name" v-model="name"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   placeholder="Maria Camila Salcedo">
          </div>
          <div>
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
            <input type="email" id="email" v-model="email"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   placeholder="ejemplo@email.com">
          </div>
          <div>
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input type="password" id="password" v-model="password"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="flex items-center justify-center">
            <button
                type="submit"
                :disabled="isLoading"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >{{ isLoading ? 'Registrando...' : 'Registrarse' }}</button>
          </div>

          <div v-if="authStore.error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {{ authStore.error }}
          </div>

          <div class="text-center mt-4">
            <button
                type="button"
                @click="goToLogin"
                class="text-blue-500 hover:text-blue-700 font-semibold"
            >¿Ya tienes cuenta? Inicia sesión</button>
          </div>
        </form>
      </div>
    </div>
  </template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { ROLES } from '@/shared/constants/roles';

const router = useRouter();
const authStore = useAuthStore();

const name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const isLoading = ref(false);

const register = async () => {
    if (!name.value || !email.value || !password.value) {
        return;
    }

    isLoading.value = true;

    try {
        // Por defecto, todos los nuevos usuarios son clientes
        await authStore.register(email.value, password.value, name.value, ROLES.CUSTOMER);

        // Redirigir al dashboard de cliente
        router.push({ name: ROUTE_NAMES.CUSTOMER_DASHBOARD });
    } catch (error: any) {
        console.error('Error al registrarse:', error);
    } finally {
        isLoading.value = false;
    }
};

const goToLogin = () => {
    router.push({ name: ROUTE_NAMES.LOGIN });
};
</script>