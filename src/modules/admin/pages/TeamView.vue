<template>
    <div class="p-6 bg-[#F9EBD9] min-h-screen space-y-6">
      <!-- HEADER -->
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-orange-600">EQUIPO DE TRABAJO</h1>
        <div class="flex items-center gap-4">
          <!-- Buscador -->
          <div class="relative">
            <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <!-- Campana y avatar -->
          <BellIcon class="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer"/>
          <img
            :src="user.avatar"
            alt="avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>

      <!-- BOTÓN AGREGAR -->
      <div class="flex justify-end">
        <button
          @click="openAddMember()"
          class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Agregar
        </button>
      </div>

      <!-- TABLA -->
      <div class="bg-white rounded-xl shadow overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-orange-500">
            <tr>
              <th class="px-6 py-3 text-left text-white text-sm font-medium">Nombre</th>
              <th class="px-6 py-3 text-left text-white text-sm font-medium">Apellido</th>
              <th class="px-6 py-3 text-left text-white text-sm font-medium">N° documento</th>
              <th class="px-6 py-3 text-left text-white text-sm font-medium">Teléfono</th>
              <th class="px-6 py-3 text-left text-white text-sm font-medium">Correo electrónico</th>
              <th class="px-6 py-3 text-left text-white text-sm font-medium">Rol</th>
              <th class="px-6 py-3 text-center text-white text-sm font-medium">Detalles</th>
              <th class="px-6 py-3 text-center text-white text-sm font-medium">Eliminar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="member in paginatedMembers"
              :key="member.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap flex items-center">
                <UserCircleIcon class="w-6 h-6 text-gray-400 mr-2"/>
                <span class="text-gray-800">{{ member.firstName }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.lastName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.document }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <EyeIcon class="w-6 h-6 text-blue-500 cursor-pointer"/>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <TrashIcon class="w-6 h-6 text-red-500 cursor-pointer"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Mensaje si no hay resultados -->
      <div v-if="filteredMembers.length === 0" class="text-center text-gray-500 mt-4">
        No se encontraron resultados para "{{ searchQuery }}"
      </div>
      <!-- Modal -->
      <NuevoEmpleadoModal :visible="showNewEmployee" @close="handleCloseModal" @save="handleSaveMember" />
      <!-- PAGINACIÓN -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-l-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            ‹
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1 border-t border-b border-gray-300 bg-white hover:bg-gray-100"
            :class="{'bg-orange-500 text-white': page === currentPage}"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-r-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            ›
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-700">Registros por página</span>
          <select
            v-model.number="pageSize"
            class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option v-for="size in [5,7,10,20]" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { TeamMember } from '@/core/entities/TeamMember';
import { useObtenerEmpleados } from '../composables/useObtenerEmpleados';
import { usePaginacion } from '../composables/usePaginacion';
import {
  MagnifyingGlassIcon as SearchIcon,
  BellIcon,
  UserCircleIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';

import NuevoEmpleadoModal from '../components/team/NuevoEmpleadoModal.vue';



const auth = useAuthStore()
const user = {
  avatar: auth.user?.avatar || 'https://i.pravatar.cc/40'
}
const { empleados, cargarEmpleados, loading, error } = useObtenerEmpleados();

onMounted(() => {
  cargarEmpleados()
});

// Búsqueda
const searchQuery = ref('');
const showNewEmployee = ref(false);

const filteredMembers = computed(() =>
  empleados.value.filter(m =>
    [m.firstName, m.lastName, m.document, m.phone, m.email, m.role]
      .some(f => f.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
);

// Paginación
const {
  currentPage,
  pageSize,
  totalPages,
  paginatedItems: paginatedMembers, // Renombramos para que el template no cambie
  nextPage,
  prevPage,
  goToPage
} = usePaginacion(() => filteredMembers.value)

// Acciones
function openAddMember() {
  showNewEmployee.value = true;
}

function handleCloseModal() {
  showNewEmployee.value = false;
}

function handleSaveMember(member: TeamMember) {
  empleados.value.push(member)
}

</script>
