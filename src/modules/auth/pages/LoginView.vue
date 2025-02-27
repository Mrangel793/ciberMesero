<template>
    <div class="min-h-screen flex justify-center items-center bg-cover bg-center"
        :style="{ backgroundImage: `url(${fondo})` }">
        <div class="bg-white p-8 rounded-xl shadow-lg shadow-[#E78D1B63] w-full max-w-md m-auto">
            <h1 class="text-2xl font-semibold text-center mb-6 texto">INICIAR SESIÓN</h1>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label for="email" class="block text-md font-bold mb-2 texto">Correo electrónico</label>
                    <div class="relative">
                        <input type="email" id="email" placeholder="ejemplo@email.com" v-model="email" required
                            class="bg-[#ECECEC] appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <div
                            class="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full bg-[#FD7401] rounded">
                            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 0l-7.89 5.26a2 2 0 01-2.22 0L3 8m0 0v10a2 2 0 002 2h14a2 2 0 002-2V8m-1-1h-9.01m-9.01 0H5" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <label for="password" class="block text-md font-bold mb-2 texto">Contraseña</label>
                    <div class="relative mb-4">
                        <input type="password" id="password" placeholder="********" v-model="password" required
                            class="bg-[#ECECEC] appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <div
                            class="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full bg-[#FD7401] rounded">
                            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <a href="#" class="texto text-sm text-[#4285F4] hover:text-[#2270f1]">
                            ¿Has olvidado tu contraseña?
                        </a>
                    </div>
                </div>
                <div class="flex items-center justify-center mb-8">
                    <button
                        class="texto w-full bg-[#FD7401] hover:bg-[#fb7e15] text-white py-2 px-4 rounded-lg focus:outline-none shadow-xl shadow-[#FD74014D]"
                        type="submit">
                        Ingresar
                    </button>
                </div>
            </form>

            <!-- Estilos de '---- OR ----' -->
            <div class="flex items-center my-4 mb-8">
                <div class="flex-grow border-t border-[#C2C2C2]"></div>
                <p class="texto text-[#C2C2C2] font-bold mx-4">OR</p>
                <div class="flex-grow border-t border-[#C2C2C2]"></div>
            </div>

            <div class="flex items-center justify-center">
                <button
                    class="texto w-full bg-white hover:bg-gray-100 text-[#FD7401] font-semibold py-2 px-4 border border-[#FD7401] rounded shadow">
                    Registrarse
                </button>
            </div>

            <div class="flex justify-center mt-4 space-x-4">
                <!-- Icono de google -->
                <button class="rounded-full p-2 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="34" height="34" viewBox="0 0 48 48">
                        <path fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
                        </path>
                        <path fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
                        </path>
                        <path fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
                        </path>
                        <path fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
                        </path>
                    </svg>
                </button>

                <!-- icono de facebook -->
                <button class="rounded-full shadow-xl w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 48 48">
                        <path fill="#3f51b5" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path>
                        <path fill="#fff"
                            d="M29.368,24H26v12h-5V24h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H30v4h-2.287 C26.104,16,26,16.6,26,17.723V20h4L29.368,24z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import fondo from '@/assets/imagenes/fondo.png';
// import { signInWithEmailAndPassword, getAuth  } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { ref } from 'vue';

// const auth = getAuth();
// const db = getFirestore();

// export const userRole = ref(null);

// const email = ref('');
// const password = ref('');
// const errorMessage = ref('');

// const login = async () => {
//     errorMessage.value = '';

//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
//         const user = userCredential.user;
//         console.log('Usuario autenticado con UID:', user.uid);
//         console.log('User logged in');

//         // 1. Obtener el UID del usuario autenticado
//         const uid = user.uid;

//         // 2. Consultar Firestore para obtener el documento del usuario
//         const userDocRef = doc(db, 'users', uid);
//         const userDocSnap = await getDoc(userDocRef);

//         if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             const fetchedUserRole = userData.role; // Obtiene el rol del documento
//             console.log('Rol del usuario obtenido de Firestore:', fetchedUserRole);

//             // 3. Guardar el rol en la ref 'userRole' (estado local del componente)
//             userRole.value = fetchedUserRole; // Asigna el rol a la ref 'userRole'

//         } else {
//             console.error('Documento de usuario no encontrado en Firestore para UID:', uid);
//             errorMessage.value = 'Error al obtener información del usuario.';
//             userRole.value = null; // Asegúrate de resetear userRole en caso de error
//             return; // Importante salir de la función si no se encuentra el documento
//         }

//     } catch (error: any) {
//         console.error('Error al iniciar sesión:', error.code, error.message);
//         errorMessage.value = error.message;
//         userRole.value = null; // Asegúrate de resetear userRole en caso de error
//     }
//     return {
//         email,
//         password,
//         errorMessage,
//         login,
//         userRole
//     }
// };

</script>