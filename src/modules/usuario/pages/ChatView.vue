<template>
    <div class="bg-[#1C1C1C] min-h-screen text-white flex flex-col items-center justify-center px-4">
        <!-- Encabezado -->
        <nav class="absolute top-0 container mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1">
                <a href="#">
                    <h1 class="text-2xl font-bold text-white">CiberMesero</h1>
                </a>
            </div>

            <div class="hidden lg:flex lg:gap-x-12">
                <img src="@/assets/imagenes/comida.png" alt="CiberMesero" class="w-10">
            </div>

            <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
                <router-link to="/login" class="font-semibold text-white bg-[#FD7401] px-2 py-1 rounded-lg">Iniciar
                    sesión</router-link>
            </div>
        </nav>

        <!-- Texto descriptivo -->
        <div class="text-white text-center mb-6">
            <p class="text-2xl font-bold">
                ¡Hola!👋
            </p>
            <p class="text-lg mt-2">
                Soy tu mesero virtual, encantado/a de conocerte. <br>
                ¿En qué puedo ayudarte?
            </p>
        </div>

        <!-- Opciones -->
        <div class="space-x-2 mb-32">
            <button class="border border-[#A7A7A7] rounded-md px-3 text-base">Métodos de pago</button>
            <button class="border border-[#A7A7A7] rounded-md px-3 text-base">Ofertas</button>
            <button class="border border-[#A7A7A7] rounded-md px-3 text-base">Recomendaciones</button>
            <button class="border border-[#A7A7A7] rounded-md px-3 text-base">Cancelar orden</button>
            <button class="border border-[#A7A7A7] rounded-md px-3 text-base">Modificar orden</button>
            <button class="border border-[#A7A7A7] rounded-md px-3 text-base">Menú</button>
        </div>

        <!-- Input para el mensaje-->
        <div class="w-full max-w-2xl flex items-center bg-[#D9D9D9] p-2 rounded-lg shadow-md">
            <input type="text" placeholder="Envía un mensaje o habla directamente con CiberMesero..."
                class="flex-1 p-2 bg-transparent border-none focus:outline-none text-black placeholder-[#1E1E1E]" />
            
            <!-- Icono del microfono  -->
            <button class="p-2 text-black"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-mic">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            </button>
        </div>
    </div>
</template>