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
            <button type="submit"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  </template>

<script lang="ts" setup>
import { auth } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';
import type { User } from '@/interfaces/user.interface';

const name = ref<string>('');
const email = ref<string>('');
const password = ref('');
const errorMessage = ref('');


const register =  async() => {
    errorMessage.value = '';

    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log('User registered');
    } catch (error:any) {
        console.log(error.response.data.message);
        errorMessage.value = error.response.data.message;
    }

    return{
        name,
        email,
        password,
        errorMessage,
        register
    }
}



</script>