<template>
    <!-- Sección Hero con fondo gradiente -->
    <div class="relative w-full overflow-hidden h-auto lg:h-[40rem]">
        <!-- Fondo Degradado -->
        <div
            class="absolute inset-0 bg-[linear-gradient(to_bottom,#181818_0%,#E67300_80%)] rounded-b-[50%] w-[110%] scale-x-[1.5] h-[40rem] left-[-5%]">
        </div>

        <!-- Header -->
        <nav class="relative container mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1">
                <a href="#">
                    <h1 class="text-2xl font-bold text-white">CiberMesero</h1>
                </a>
            </div>

            <!-- Botón hamburguesa -->
            <div class="lg:hidden">
                <button @click="isMenuOpen = !isMenuOpen" class="text-white focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">

                        <!-- Icono de las tres lineas -->
                        <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />

                        <!-- icono de la X -->
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="hidden lg:flex lg:gap-x-12">
                <a href="#" class="font-semibold text-white">INICIO</a>
                <a href="#" class="font-semibold text-white">QUIÉNES SOMOS</a>
                <a href="#" class="font-semibold text-white">CONTÁCTANOS</a>
            </div>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
                <a href="#" class="font-semibold text-white">Iniciar Sesión</a>
                <a href="#" class="font-semibold text-white">Registrarse</a>
            </div>
        </nav>

        <!-- Menú móvil desplegable -->
        <div v-if="isMenuOpen"
            class="lg:hidden absolute top-20 inset-x-0 z-50 bg-[#181818] py-4 px-6 shadow-lg rounded-b-lg transition-all duration-300 ease-in-out">
            <div class="flex flex-col space-y-4">
                <a href="#" class="font-semibold text-white py-2 block">INICIO</a>
                <a href="#" class="font-semibold text-white py-2 block">QUIÉNES SOMOS</a>
                <a href="#" class="font-semibold text-white py-2 block">CONTÁCTANOS</a>
                <hr class="border-gray-600">
                <a href="#" class="font-semibold text-white py-2 block">Iniciar Sesión</a>
                <a href="#" class="font-semibold text-white py-2 block">Registrarse</a>
            </div>
        </div>

        <!-- Contenido Principal -->
        <div class="relative container mx-auto px-6 pt-14 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center justify-between">
                <!-- Texto a la izquierda -->
                <div class="w-full lg:w-2/4 text-center mb-8 -mt-0 lg:-mt-14">
                    <h1 class="titulo text-5xl text-[#FF8000] sm:text-6xl"
                        style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);">
                        ¿Necesitas nuestro servicio?
                    </h1>

                    <p class="text-lg lg:text-xl text-white mt-6 lg:mt-12">
                        Si tienes alguna duda o requieres más información sobre cómo nuestros meseros robots pueden
                        mejorar tu experiencia, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
                    </p>

                </div>

                <!-- Formulario de contacto -->
                <div class="bg-[#00000040] p-6 rounded-[4rem] w-full lg:w-[29%] max-w-md mx-auto mb-8 lg:mb-0">
                    <form>
                        <p class="text-lg font-semibold text-center mb-4 text-white">
                            FORMULARIO DE CONTACTO
                        </p>
                        <div class="mb-2">
                            <label for="" class="block text-md mb-1 text-white">NOMBRE COMPLETO</label>
                            <input type="" id=""
                                class="appearance-none rounded w-full py-2 px-3 text-sm focus:outline-none focus:shadow-outline">
                        </div>

                        <div class="mb-2">
                            <label for="" class="block text-md mb-1 text-white">NÚMERO DE
                                CELULAR</label>
                            <input type="text" id=""
                                class="appearance-none rounded w-full py-2 px-3 text-sm focus:outline-none focus:shadow-outline">
                        </div>

                        <div class="mb-2">
                            <label for="" class="block text-md mb-1 text-white">CORREO ELECTRÓNICO</label>
                            <input type="text" id=""
                                class="appearance-none rounded w-full py-2 px-3 text-sm focus:outline-none focus:shadow-outline">
                        </div>

                        <div class="mb-3">
                            <label for="" class="block text-md mb-1 text-white">MENSAJE</label>
                            <textarea rows="2"
                                class="w-full py-2 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8000]"></textarea>
                        </div>

                        <div class="flex items-center justify-center">
                            <button
                                class="bg-[#FD7401] hover:bg-[#fb7e15] text-white py-2 px-4 rounded-full focus:outline-none shadow-xl shadow-[#FD74014D]"
                                type="submit">
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="relative pb-12">
        <!-- Imagen del robot -->
        <div class="w-full lg:w-1/2 flex justify-center -mt-10 lg:-mt-40">
            <img src="@/assets/imagenes/robot2.png" alt="CiberMesero" class="scale-90 lg:scale-110">
        </div>

        <!-- Información de contacto -->
        <div
            class="relative bg-white shadow-md shadow-[#00000066] rounded-[3rem] p-10 max-w-md w-full lg:w-[26%] -mt-6 lg:-mt-[300px] ml-28 lg:ml-auto lg:mr-48">
            <!-- Información de contacto -->
            <div class="flex items-center space-x-3 mb-5">
                <div class="bg-[#D8E5FF] text-[#003585] p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-phone">
                        <path
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </div>
                <h2 class="text-lg font-semibold">Información de contacto</h2>
            </div>
            <p class="text-sm">Teléfono: +573212652000</p>

            <hr class="my-4 border-gray-300" />

            <!-- Escríbanos -->
            <div class="flex items-center space-x-3 mb-5">
                <div class="bg-[#D8E5FF] text-[#003585] p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-mail">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </div>
                <h2 class="text-lg font-semibold">Escríbanos</h2>
            </div>
            <p class="text-sm mb-4">
                Rellena nuestro formulario y nos pondremos en contacto contigo en un plazo de 24 horas.
            </p>

            <!-- Correos -->
            <p class="text-sm mb-4"><strong>Email:</strong> CiberMesero.com</p>
            <p class="text-sm"><strong>Email:</strong> CiberMesero_2.com</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const isMenuOpen = ref(false);
</script>