<template>
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl max-w-2xl w-full mx-4 p-6 relative">
          <!-- Close -->
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          <!-- Título -->
          <h2 class="text-xl sm:text-2xl font-semibold text-center mb-6">
            NUEVA PROMOCIÓN
          </h2>
  
          <form @submit.prevent="onSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Imagen -->
            <div class="col-span-full">
              <label
                for="logo"
                class="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-400 transition"
              >
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                />
                <span class="text-gray-400">Cargar imagen</span>
              </label>
              <img
                v-if="form.logoPreview"
                :src="form.logoPreview"
                alt="Preview"
                class="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            </div>
  
            <!-- Título -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>
            <!-- Descripción -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                v-model="form.description"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>
  
            <!-- Restaurante -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-1"
              >Seleccione el restaurante</label>
              <select
                v-model="form.restaurant"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              >
                <option value="" disabled>Seleccione...</option>
                <option v-for="r in restaurantes" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <!-- Dirección -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>
  
            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>
            <!-- Precio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                v-model="form.price"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>
  
            <!-- Platillos -->
            <div class="col-span-full">
              <span class="block text-sm font-medium text-gray-700 mb-1">
                Seleccione los platillos
              </span>
              <div class="flex flex-wrap gap-4">
                <label
                  v-for="dish in platillos"
                  :key="dish"
                  class="inline-flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    :value="dish"
                    v-model="form.dishes"
                    class="h-4 w-4 text-orange-500 border-gray-300 rounded"
                  />
                  <span class="text-gray-700">{{ dish }}</span>
                </label>
              </div>
            </div>
  
            <!-- Fecha inicio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
              <input
                v-model="form.startDate"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>
            <!-- Fecha fin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
              <input
                v-model="form.endDate"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>
  
            <!-- Botón Agregar -->
            <div class="col-span-full text-center mt-4">
              <button
                type="submit"
                class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  
  /** Control de visibilidad desde el padre */
  const props = defineProps<{ visible: boolean }>()
  
  /** Emite evento al cerrar o enviar */
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'create', payload: any): void
  }>()
  
  /** Lista de restaurantes y platillos (puedes traerlos de tu API) */
  const restaurantes = ref(['McDonalds', 'Burger King', 'Pizza House'])
  const platillos = ref(['Perro caliente', 'Hamburguesa', 'Mazorcada', 'Salchipierro'])
  
  /** Form state */
  const form = reactive({
    logoFile: null as File | null,
    logoPreview: '',
    title: '',
    description: '',
    restaurant: '',
    address: '',
    phone: '',
    price: '',
    dishes: [] as string[],
    startDate: '',
    endDate: ''
  })
  
  function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] || null
    form.logoFile = file
    if (file) {
      const reader = new FileReader()
      reader.onload = () => { form.logoPreview = reader.result as string }
      reader.readAsDataURL(file)
    }
  }
  
  function onSubmit() {
    // Aquí validas/ envías al API
    const payload = { ...form }
    emit('create', payload)
    emit('close')
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  