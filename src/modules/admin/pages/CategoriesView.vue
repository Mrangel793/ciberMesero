<template>
    <div class="p-6 min-h-screen bg-[#F9EBD9] space-y-6">
      <!-- HEADER: Título, buscador, campana y avatar -->
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-orange-600">CATEGORÍAS</h1>

        <div class="relative flex-1 max-w-xs mx-4">
          <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input v-model="searchQuery" type="text" placeholder="Buscar..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>

        <div class="flex items-center gap-4">
          <BellIcon class="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
          <!-- <img
              :src="user.avatar"
              alt="avatar"
              class="w-8 h-8 rounded-full object-cover"
            /> -->
        </div>
      </div>

      <!-- Botón Agregar -->
      <div class="flex justify-end">
        <button @click="openAddCategory"
          class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
          Agregar
        </button>
      </div>

      <!-- GRID DE CATEGORÍAS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="cat in filteredCategories" :key="cat.id"
          class="bg-white rounded-lg shadow px-4 py-2 flex justify-between items-center">
          <span class="text-gray-800">{{ cat.name }}</span>
          <div class="flex gap-3">
            <PencilSquareIcon @click="editCategory(cat.id)"
              class="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />
            <TrashIcon @click="deleteCategory(cat.id)" class="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer" />
          </div>
        </div>
      </div>

      <!-- Modal de nueva categoría -->
      <NuevaCategoriaModal :visible="showNewCat" @close="handleCloseModal" @save="handleSaveCategory" />
    </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { useCategorias } from '../composables/useCategorias';

import {
  // SearchIcon,
  BellIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import NuevaCategoriaModal from '../components/categories/NuevaCategoriaModal.vue';
import type { Category } from '@/core/entities/Category';

const showNewCat = ref(false)
const { categorias, cargarCategorias } = useCategorias();


// Control de búsqueda
const searchQuery = ref('')

// Datos dinámicos de ejemplo
const categories = ref<Category[]>([
  { id: '1', name: 'Perros calientes' },
  { id: '2', name: 'Hamburguesas' },
  { id: '3', name: 'Papas' },
  { id: '4', name: 'Empanadas' }
  // …más categorías…
])

// Computed con filtro por nombre
const filteredCategories = computed(() =>
  categorias.value.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);


// Métodos de acción
const router = useRouter()
function openAddCategory() {
  showNewCat.value = true
}
function editCategory(id: string) {
  router.push(`/categorias/${id}/editar`)
}
function deleteCategory(id: string) {
  // lógica de borrado, p.ej. llamada API y luego:
  categories.value = categories.value.filter(c => c.id !== id)
}
function handleSaveCategory(payload: { name: string }) {
  console.log('Crear categoría:', payload.name)
}
function handleCloseModal() {
  showNewCat.value = false
  cargarCategorias()
}

</script>

