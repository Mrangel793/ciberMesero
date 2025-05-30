<template>
  <transition name="fade">
    <div
      v-if="props.visible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl max-w-lg w-full mx-4 p-6 relative">
        <!-- Cerrar -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-6">
          NUEVO PLATILLO
        </h2>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Upload imagen -->
          <div>
            <label for="image"
              class="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-400 transition">
              <input id="image" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              <span class="text-gray-400">Cargar imagen</span>
            </label>
            <img v-if="form.preview" :src="form.preview" alt="Preview"
              class="mt-2 w-32 h-32 object-cover rounded-lg" />
          </div>

          <!-- Switch disponibilidad -->
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">Disponibilidad del platillo</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.available" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:bg-orange-600 transition">
              </div>
              <div
                class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5">
              </div>
            </label>
          </div>

          <!-- Nombre / Precio -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input v-model="form.name" type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input v-model.number="form.price" type="number"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
            </div>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.description" rows="3"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="form.category"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required>
              <option value="" disabled>Seleccione...</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <!-- Botón Agregar -->
          <div class="text-center mt-6">
            <button type="submit"
              class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
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
import { useCrearPlato } from '@/modules/admin/composables/useCrearPlato'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create'): void
}>()

const { crear } = useCrearPlato()

const form = reactive({
  file: null as File | null,
  preview: '',
  available: true,
  name: '',
  price: 0,
  description: '',
  category: ''
})

const categories = ref(['Entradas', 'Hamburguesas', 'Bebidas', 'Postres'])

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  form.file = file
  if (file) {
    const reader = new FileReader()
    reader.onload = () => (form.preview = reader.result as string)
    reader.readAsDataURL(file)
  }
}

async function onSubmit() {
  try {
    const newPlato = {
      name: form.name,
      price: form.price,
      description: form.description,
      image: form.preview || '',
      onPromo: false,
      category: form.category,
      id: Date.now()
    }

    await crear(newPlato)
    emit('create')
    emit('close')
  } catch (e) {
    console.error('Error al crear plato:', e)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
