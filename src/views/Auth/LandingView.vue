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

      <!-- Contenido Principal -->
      <div class="relative container mx-auto px-6 pt-16 lg:px-8">
        <div class="flex flex-col-reverse lg:flex-row items-center justify-between">
          <!-- Texto a la izquierda -->
          <div class="lg:w-2/4 text-center">
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
              <a href="#" class="bg-[#FF8000] text-white px-5 py-2 rounded-full text-xl tracking-wide shadow-xl">
                Explorar más
              </a>
            </div>
          </div>

          <!-- Imagen del robot a la derecha -->
          <div class="lg:w-1/2 flex justify-center">
            <img src="@/assets/imagenes/robot.png" alt="CiberMesero" class="scale-110">
          </div>
        </div>
      </div>
    </div>


    <!-- Sección de Cards con fondo blanco -->
    <div class="bg-white w-full mt-28">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">

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
        <div class="relative bg-[#FFCE9D] py-16 sm:py-12 mb-10 rounded-[8rem] rounded-tr-none">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="text-center mb-16">
              <h2 class="titulo text-4xl text-[#FF8000]">¿Quiénes somos?</h2>
              <p class="mt-4 text-2xl max-w-4xl mx-auto mb-24">
                Somos una plataforma innovadora que ofrece a los restaurantes la oportunidad de incorporar meseros
                inteligentes en su servicio. Con nuestra tecnología, los clientes pueden realizar sus pedidos
                directamente desde su celular, mejorando la experiencia de cada comida.
              </p>
            </div>

            <!-- Sección 'Quiénes somos' -->
            <div class="relative grid md:grid-cols-2 items-center">
              <!-- Imagen del teléfono -->
              <div class="relative flex justify-center transform -translate-x-16 z-10">
                <img src="@/assets/imagenes/mano.png" alt="Hand holding phone" class="w-[85%] scale-150"/>
              </div>

              <!-- Sección 'Nuestra misión' -->
              <div class="relative z-10 transform translate-x-24 justify-center mb-14">
                <div class="space-y-2 px-12 py-12 bg-[#C2C2C2] rounded-l-3xl shadow-lg mb-6">
                  <h3 class="titulo text-3xl text-white text-center">NUESTRA MISIÓN</h3>
                  <p class="text-white text-2xl text-center">
                    Transformar la forma en que los restaurantes interactúan con sus clientes, brindando un servicio más
                    eficiente y moderno.
                  </p>
                </div>
                <div class="flex justify-center">
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

    <!-- Pie de página -->
    <footer class="bg-[#FF8000] text-center py-1">
      Copyright © [2025] [Nombre de tu plataforma]
    </footer>
  </div>
</template>