<template>
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-6 text-center">Nuevo Restaurante</h1>
  
        <!-- Formulario -->
        <form @submit.prevent="guardarRestaurante">
          <!-- Cargar Logo -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Cargar Logo</label>
            <input
              type="file"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
  
          <!-- Nombre -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              v-model="nombre"
              placeholder="Nombre del restaurante"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <!-- Descripción -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              v-model="descripcion"
              placeholder="Descripción del restaurante"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
  
          <!-- Horario -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Hora de Apertura</label>
              <input
                type="time"
                v-model="horaApertura"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Hora de Cierre</label>
              <input
                type="time"
                v-model="horaCierre"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
  
          <!-- Dirección -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              v-model="direccion"
              placeholder="Dirección del restaurante"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <!-- Teléfono -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              v-model="telefono"
              placeholder="Teléfono del restaurante"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <!-- Botón Guardar -->
          <div class="text-center">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Variables reactivas para el formulario
  const nombre = ref('');
  const descripcion = ref('');
  const horaApertura = ref('');
  const horaCierre = ref('');
  const direccion = ref('');
  const telefono = ref('');
  
  // Función para guardar el restaurante
  const guardarRestaurante = () => {
    console.log('Restaurante guardado:', {
      nombre: nombre.value,
      descripcion: descripcion.value,
      horaApertura: horaApertura.value,
      horaCierre: horaCierre.value,
      direccion: direccion.value,
      telefono: telefono.value,
    });
  };
  </script>
