<template>
    <div class="min-h-screen flex justify-center items-center bg-cover bg-center"
        :style="{ backgroundImage: `url(${fondo})` }">
        <div class="bg-white p-8 rounded-xl shadow-lg shadow-[#E78D1B63] w-full max-w-md m-auto">
            <h1 class="text-3xl font-semibold text-center mb-3 texto">¿HAS OLVIDADO TU CONTRASEÑA?</h1>
            <form>
                <p class="text-md font-semibold texto text-center mb-8">
                    Ingresa tu correo electrónico para enviarte un código temporal, el cual utilizarás más adelante.
                </p>
                <div class="mb-9">
                    <label for="email" class="block text-md font-bold mb-2 texto">Correo electrónico</label>
                    <div class="relative">
                        <input type="email" id="email" placeholder="ejemplo@email.com"
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

                <div class="flex items-center justify-center mb-4">
                    <button
                        class="texto w-full bg-[#FD7401] hover:bg-[#fb7e15] text-white py-2 px-4 rounded-lg focus:outline-none shadow-xl shadow-[#FD74014D]"
                        type="submit">
                        Solicitar código
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import fondo from '@/assets/imagenes/fondo.png';
</script>
