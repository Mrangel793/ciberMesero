<template>
  <div class="w-full">
    <!-- Sección Hero con fondo gradiente -->
    <div class="relative w-full overflow-hidden h-[40rem]">
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
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="hidden lg:flex lg:gap-x-12">
          <a href="#" class="font-semibold text-white">INICIO</a>
          <a href="#quienes-somos" class="font-semibold text-white">QUIÉNES SOMOS</a>
          <router-link to="/contact" class="font-semibold text-white">CONTÁCTANOS</router-link>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
          <router-link to="login" class="font-semibold text-white">Iniciar Sesión</router-link>
          <router-link to="register" class="font-semibold text-white">Registrarse</router-link>
        </div>
      </nav>

      <!-- Menú móvil desplegable -->
      <div v-if="isMenuOpen"
        class="lg:hidden absolute top-20 inset-x-0 z-50 bg-[#181818] py-4 px-6 shadow-lg rounded-b-lg transition-all duration-300 ease-in-out">
        <div class="flex flex-col space-y-4">
          <a href="#" class="font-semibold text-white py-2 block">INICIO</a>
          <a href="#quienes-somos" class="font-semibold text-white py-2 block">QUIÉNES SOMOS</a>
          <router-link to="/contact" class="font-semibold text-white py-2 block">CONTÁCTANOS</router-link>
          <hr class="border-gray-600">
          <router-link to="/login" class="font-semibold text-white">Iniciar Sesión</router-link>
          <router-link to="/register" class="font-semibold text-white">Registrarse</router-link>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="relative container mx-auto px-6 pt-16 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center justify-between">
          <!-- Texto a la izquierda -->
          <div class="w-full lg:w-2/4 text-center mb-8 lg:mb-0">
            <h1 class="titulo text-6xl text-[#FF8000] sm:text-7xl" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);">
              ¡Revolucionamos el juego!
            </h1>

            <p class="text-3xl font-medium text-white mt-12">
              Haz de tu experiencia algo único
            </p>

            <p class="text-xl text-white mt-4">
              Pide tu orden a través del celular, y CiberMesero hará el resto.
            </p>

            <div class="mb-8 mt-6">
              <span class="bg-white/60 px-4 py-1 rounded-lg text-lg text-[#3C3C3C] inline-flex justify-center gap-4">
                <span>Innovador</span>
                <span>Revolucionario</span>
                <span>Exclusivo</span>
              </span>
            </div>

            <div>
              <a href="#explorar-mas"
                class="bg-[#FF8000] text-white px-5 py-2 rounded-full text-xl tracking-wide shadow-xl">
                Explorar más
              </a>
            </div>
          </div>

          <!-- Imagen del robot a la derecha -->
          <div class="hidden lg:flex lg:w-1/2 justify-center">
            <div class="relative h-full">
              <img src="@/assets/imagenes/robot.png" alt="CiberMesero" class="w-auto scale-110 object-contain">
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Sección de Cards con fondo blanco -->
    <div class="bg-white w-full mt-28">
      <div class="container mx-auto px-6 lg:px-8">
        <div id="explorar-mas" class="grid grid-cols-2 md:grid-cols-4 gap-8">

          <!-- Card 1 -->
          <div
            class="flex flex-col items-center p-8 bg-gradient-to-b from-[#E1E1E1] to-white rounded-3xl shadow-xl transform -translate-y-12">
            <!-- imagen de bombilla -->
            <div class="mb-4">
              <img src="@/assets/imagenes/innovacion.png" alt="Innovación">
            </div>
            <p class="text-2xl text-[#565656] text-center">Innovación Continua</p>
          </div>

          <!-- Card 2 -->
          <div class="flex flex-col items-center p-8 bg-gradient-to-b from-[#E1E1E1] to-white rounded-3xl shadow-xl">
            <!-- imagen de rayo -->
            <div class="mb-4 w-40">
              <img src="@/assets/imagenes/eficiencia.png" alt="Eficiencia">
            </div>
            <p class="text-2xl text-[#565656] text-center">Eficiencia y</p>
            <p class="text-2xl text-[#565656] text-center">Rapidez</p>
          </div>

          <!-- Card 3 -->
          <div
            class="flex flex-col items-center p-8 bg-gradient-to-b from-[#E1E1E1] to-white rounded-3xl shadow-xl transform -translate-y-12">
            <!-- imagen de diana -->
            <div class="mb-4 w-40">
              <img src="@/assets/imagenes/experiencia.png" alt="Experiencia">
            </div>
            <p class="text-2xl text-[#565656] text-center">Experiencia Personalizada</p>
          </div>

          <!-- Card 4 -->
          <div class="flex flex-col items-center p-8 bg-gradient-to-b from-[#E1E1E1] to-white rounded-3xl shadow-xl">
            <!-- imagen de enlace -->
            <div class="mb-8 w-40 mt-6">
              <img src="@/assets/imagenes/facil.png" alt="Integración">
            </div>
            <p class="text-2xl text-[#565656] text-center">Fácil</p>
            <p class="text-2xl text-[#565656] text-center">Integración</p>
          </div>
        </div>

        <!-- Sección descripción -->
        <div class="mx-auto mt-24  pb-24">
          <div class="bg-gradient-to-b from-[#E1E1E1] to-[#F8F8F8] rounded-3xl p-5">
            <div class="flex flex-col items-center">
              <!-- imagen de bombilla -->
              <img src="@/assets/imagenes/innovacion.png" alt="">

              <h2 class="titulo text-center text-4xl mb-8">
                Innovación continua
              </h2>

              <p class="text-center text-2xl max-w-5xl mb-10">
                Nos dedicamos a ofrecer soluciones tecnológicas avanzadas que mejoran la experiencia en los
                restaurantes, manteniéndonos a la vanguardia de la tecnología para ofrecer lo mejor a nuestros
                clientes.
              </p>
            </div>
          </div>
        </div>
        <!-- Sección Quienes somos -->
        <div id="quienes-somos" class="relative bg-[#FFCE9D] py-16 sm:py-12 mb-10 rounded-[8rem] rounded-tr-none">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="text-center mb-16">
              <h2 class="titulo text-4xl text-[#FF8000]">¿Quiénes somos?</h2>
              <p class="mt-4 text-2xl max-w-4xl mx-auto mb-24">
                Somos una plataforma innovadora que ofrece a los restaurantes la oportunidad de incorporar meseros
                inteligentes en su servicio. Con nuestra tecnología, los clientes pueden realizar sus pedidos
                directamente desde su celular, mejorando la experiencia de cada comida.
              </p>
            </div>

            <!-- Sección imagen y texto -->
            <div class="relative grid md:grid-cols-2 items-center">
              <!-- Imagen del teléfono -->
              <div class="relative flex justify-center transform -translate-x-16 z-10">
                <img src="@/assets/imagenes/mano.png" alt="Hand holding phone" class="w-[85%] scale-150" />
              </div>

              <!-- Sección 'Nuestra misión' -->
              <div class="relative z-10 transform translate-x-20 justify-center mb-14 mt-14 md:mt-0">
                <div class="space-y-2 px-12 py-12 bg-[#C2C2C2] rounded-l-3xl shadow-lg mb-6">
                  <h3 class="titulo text-3xl text-white text-center">NUESTRA MISIÓN</h3>
                  <p class="text-white text-2xl text-center">
                    Transformar la forma en que los restaurantes interactúan con sus clientes, brindando un servicio más
                    eficiente y moderno.
                  </p>
                </div>
                <div class="flex justify-center">
                  <router-link to="/contact"
                    class="mt-4 bg-[#E67300] text-white px-8 py-3 rounded-full hover:bg-[#FF8000] transition-colors">
                    Contáctanos
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ============================= -->
    <!-- Sección de Planes -->
    <!-- ============================= -->
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-12">Nuestros Planes</h2>
        <div class="grid gap-8 lg:grid-cols-3">

          <!-- Plan Básico -->
          <div class="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="px-6 py-8 text-center">
              <div class="inline-flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full mb-4">B
              </div>
              <h3 class="text-2xl font-semibold text-gray-800">Básico</h3>
              <p class="mt-2 text-3xl font-bold text-gray-900">
                $39.000 <span class="text-base font-medium text-gray-600">COP/mes</span>
              </p>
              <p class="mt-1 text-sm text-gray-600">Prueba gratuita: 7 días</p>
            </div>
            <ul class="flex-1 px-6 space-y-3">
              <li class="flex justify-between items-center">
                <span>Gestión de Menú</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Chatbot de Texto</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Gestión de Pedidos</span>
                <XMarkIcon class="w-5 h-5 text-red-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Personalización del Chatbot</span>
                <XMarkIcon class="w-5 h-5 text-red-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Panel con estadísticas básicas</span>
                <XMarkIcon class="w-5 h-5 text-red-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Mesas/chats simultáneos</span>
                <span class="font-medium">Hasta 3</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Acceso a feedback de clientes</span>
                <XMarkIcon class="w-5 h-5 text-red-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Integración de voz (Union Iot)</span>
                <XMarkIcon class="w-5 h-5 text-red-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Acceso a promociones/cupones inteligentes</span>
                <XMarkIcon class="w-5 h-5 text-red-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Soporte técnico</span>
                <span class="font-medium">Correo</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Actualizaciones automáticas</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Posibilidad de cancelación</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
            </ul>
            <!-- Boton -->
            <div class="px-6 pb-8">
              <router-link :to="{ name: 'Register', query: { role: 'admin', plan: 'basico' } }"
                class="block w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition text-center">
                Seleccionar Plan
              </router-link>
            </div>
          </div>

          <!-- Plan Intermedio -->
          <div class="flex flex-col bg-white rounded-2xl shadow-xl ring-2 ring-yellow-200 overflow-hidden">
            <div class="px-6 py-8 text-center bg-yellow-50">
              <div class="inline-flex items-center justify-center w-10 h-10 bg-yellow-400 text-white rounded-full mb-4">
                I</div>
              <h3 class="text-2xl font-semibold text-gray-800">Intermedio</h3>
              <p class="mt-2 text-3xl font-bold text-gray-900">
                $79.000 <span class="text-base font-medium text-gray-600">COP/mes</span>
              </p>
              <p class="mt-1 text-sm text-gray-600">Prueba gratuita: 7 días</p>
            </div>
            <ul class="flex-1 px-6 space-y-3">
              <li class="flex justify-between items-center">
                <span>Gestión de Menú</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Chatbot de Texto</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Gestión de Pedidos</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Personalización del Chatbot</span>
                <span class="flex items-center">
                  <CheckIcon class="w-5 h-5 text-green-500" />
                  <small class="ml-1 text-gray-500">(limitada)</small>
                </span>
              </li>
              <li class="flex justify-between items-center">
                <span>Panel con estadísticas básicas</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Mesas/chats simultáneos</span>
                <span class="font-medium">Hasta 8</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Acceso a feedback de clientes</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Integración de voz (Union Iot)</span>
                <XMarkIcon class="w-5 h-5 text-red-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Acceso a promociones/cupones inteligentes</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Soporte técnico</span>
                <span class="font-medium">Correo</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Actualizaciones automáticas</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Posibilidad de cancelación</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
            </ul>
            <!-- Boton -->
            <div class="px-6 pb-8">
              <router-link :to="{ name: 'Register', query: {role:'admin', plan:'intermedio'}}" class="block w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition text-center">
                Seleccionar Plan
              </router-link>
            </div>
          </div>

          <!-- Plan Avanzado -->
          <div class="flex flex-col bg-white rounded-2xl shadow-xl ring-2 ring-orange-200 overflow-hidden">
            <div class="px-6 py-8 text-center bg-orange-50">
              <div class="inline-flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full mb-4">
                A</div>
              <h3 class="text-2xl font-semibold text-gray-800">Avanzado</h3>
              <p class="mt-2 text-3xl font-bold text-gray-900">
                $149.000 <span class="text-base font-medium text-gray-600">COP/mes</span>
              </p>
              <p class="mt-1 text-sm text-gray-600">Prueba gratuita: 7 días</p>
            </div>
            <ul class="flex-1 px-6 space-y-3">
              <li class="flex justify-between items-center">
                <span>Gestión de Menú</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Chatbot de Texto</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Gestión de Pedidos</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Personalización del Chatbot</span>
                <span class="flex items-center">
                  <CheckIcon class="w-5 h-5 text-green-500" />
                  <small class="ml-1 text-gray-500">(total, con IA entrenable)</small>
                </span>
              </li>
              <li class="flex justify-between items-center">
                <span>Panel con estadísticas básicas</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Mesas/chats simultáneos</span>
                <span class="font-medium">Ilimitado</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Acceso a feedback de clientes</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Integración de voz (Union Iot)</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Acceso a promociones/cupones inteligentes</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Soporte técnico</span>
                <span class="font-medium">Proritario</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Actualizaciones automáticas</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
              <li class="flex justify-between items-center">
                <span>Posibilidad de cancelación</span>
                <CheckIcon class="w-5 h-5 text-green-500" />
              </li>
            </ul>
            <!-- Boton -->
            <div class="px-6 pt-6 pb-8">
              <router-link :to="{name: 'Register', query:{role:'admin', plan:'avanzado'}}" class="block w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition text-center">
                Seleccionar Plan
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Pie de página -->
    <footer class="bg-[#FF8000] text-center py-1">
      Copyright © [2025] [Nombre de tu plataforma]
    </footer>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { ref } from 'vue';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid'
const isMenuOpen = ref(false);


</script>