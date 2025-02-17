<template>
  <div class="w-full">
    <!-- Sección Hero con fondo gradiente -->
    <div class="relative w-full">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_bottom,#181818_0%,#E67300)] rounded-b-[80px] sm:rounded-b-[150px]">
      </div>

      <!-- Header -->
      <nav class="relative container mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <a href="#">
            <h1 class="text-2xl font-bold text-white">CiberMesero</h1>
          </a>
        </div>

        <div class="hidden lg:flex lg:gap-x-12">
          <a href="#" class="font-semibold text-white">INICIO</a>
          <a href="#" class="font-semibold text-white">QUIENES SOMOS</a>
          <a href="#" class="font-semibold text-white">CONTACTANOS</a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
          <a href="#" class="font-semibold text-white">Iniciar Sesión</a>
          <a href="#" class="font-semibold text-white">Registrarse</a>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="relative container mx-auto px-6 pt-14 lg:px-8">
        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div class="text-center space-y-8">
            <h1 class="text-6xl font-black tracking-tight text-white sm:text-8xl">
              REVOLUCIONAMOS<br>EL JUEGO!
            </h1>

            <p class="text-2xl font-medium text-white mt-8">
              Haz de tu experiencia algo único
            </p>

            <p class="text-lg text-white max-w-xl mx-auto">
              Pide tu orden a través del celular, y CiberMesero hará el resto.
            </p>

            <div class="mb-8">
              <span class="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-bold">
                INNOVADOR REVOLUCIONARIO EXCLUSIVO
              </span>
            </div>

            <div class="mt-12">
              <a href="#"
                class="bg-[#E67300] text-white px-12 py-4 rounded-full text-xl font-black uppercase tracking-wide hover:bg-[#FF8000] transition-colors shadow-lg">
                EXPLORAR MÁS
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Cards con fondo blanco -->
    <div class="bg-white w-full mt-28">
      <div class="container mx-auto px-6 lg:px-8 -mt-20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Card 1 -->
          <div class="flex flex-col items-center p-8 bg-gray-100 rounded-3xl shadow-lg">
            <div class="mb-4">
              <!-- Ícono de bombilla -->
              <svg class="w-12 h-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 text-center">Innovación</h3>
            <p class="text-gray-600 text-center">Continua</p>
          </div>

          <!-- Card 2 -->
          <div class="flex flex-col items-center p-8 bg-gray-100 rounded-3xl shadow-lg">
            <div class="mb-4">
              <!-- Ícono de rayo -->
              <div class="w-12 h-12 border-2 border-blue-400 flex items-center justify-center">
                <svg class="w-8 h-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 text-center">Eficiencia y</h3>
            <p class="text-gray-600 text-center">Rapidez</p>
          </div>

          <!-- Card 3 -->
          <div class="flex flex-col items-center p-8 bg-gray-100 rounded-3xl shadow-lg">
            <div class="mb-4">
              <!-- Ícono de diana -->
              <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#FF0000" />
                <circle cx="12" cy="12" r="7" fill="#FFFFFF" />
                <circle cx="12" cy="12" r="4" fill="#FF0000" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 text-center">Experiencia</h3>
            <p class="text-gray-600 text-center">Personalizada</p>
          </div>

          <!-- Card 4 -->
          <div class="flex flex-col items-center p-8 bg-gray-100 rounded-3xl shadow-lg">
            <div class="mb-4">
              <!-- Ícono de enlace -->
              <svg class="w-12 h-12 text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 text-center">Fácil</h3>
            <p class="text-gray-600 text-center">Integración</p>
          </div>
        </div>


        <!-- Sección descripción -->
        <div class="mx-auto mt-24 max-w-4xl pb-24">
          <div class="bg-gray-100 rounded-3xl p-12 shadow-lg">
            <div class="flex flex-col items-center">
              <!-- Ícono de bombilla -->
              <svg class="w-16 h-16 text-yellow-400 mb-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
              </svg>

              <h2 class="text-center text-4xl font-black text-gray-900 mb-8">
                INNOVACIÓN CONTINUA
              </h2>

              <p class="text-center text-lg leading-8 text-gray-600 max-w-2xl">
                Nos dedicamos a ofrecer soluciones tecnológicas avanzadas que mejoran la experiencia en los
                restaurantes, manteniéndonos a la vanguardia de la tecnología para ofrecer lo mejor a nuestros
                clientes.
              </p>
            </div>
          </div>
        </div>

        <!-- Seccion Quienes somos -->
        <div class="bg-white py-16 sm:py-24">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <!-- Sección "¿Quiénes somos?" -->
            <div class="text-center mb-16">
              <h2 class="text-4xl font-bold text-[#E67300]">¿Quiénes somos?</h2>
              <p class="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
                Somos una plataforma innovadora que ofrece a los restaurantes la oportunidad de incorporar meseros
                inteligentes en su servicio. Con nuestra tecnología, los clientes pueden realizar sus pedidos
                directamente desde su celular, mejorando la experiencia de cada comida.
              </p>
            </div>

            <!-- Card gris -->
            <div class="bg-gray-100 p-8 rounded-3xl max-w-4xl mx-auto">
              <div class="grid md:grid-cols-2 gap-8 items-center">
                <!-- Imagen del teléfono -->
                <div class="flex justify-center">
                  <img src="@/assets/imagenes/imagenContact.png" alt="Hand holding phone" class="w-64" />
                </div>

                <!-- Contenido de la card -->
                <div class="space-y-6">
                  <h3 class="text-2xl font-bold text-[#E67300]">NUESTRA MISIÓN</h3>
                  <p class="text-gray-700 text-lg">
                    Transformar la forma en que los restaurantes interactúan con sus clientes, brindando un servicio más
                    eficiente y moderno.
                  </p>
                  <button
                    class="mt-4 bg-[#E67300] text-white px-8 py-3 rounded-full hover:bg-[#FF8000] transition-colors">
                    Contáctanos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>