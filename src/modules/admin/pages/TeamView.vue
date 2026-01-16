<template>
  <div class="p-6 bg-[#F9EBD9] min-h-screen space-y-6">
    <!-- HEADER (asumo que ya lo tienes y funciona) -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-orange-600">EQUIPO DE TRABAJO</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input v-model="searchQuery" type="text" placeholder="Buscar..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
        <BellIcon class="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
        <img :src="userAvatar"
        alt="avatar"
        class="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>

    <!-- BOTÓN AGREGAR -->
    <div class="flex justify-end">
      <button @click="openModalForCreate()"
        class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
        Agregar Empleado
      </button>
    </div>

    <!-- TABLA -->
    <div class="bg-white rounded-xl shadow overflow-x-auto">
      <div v-if="loading && !teamMembers.length" class="p-6 text-center text-gray-500">Cargando equipo...</div>
      <div v-if="!loading && error" class="p-6 text-center text-red-500">Error al cargar: {{ error }}</div>

      <table v-if="!loading || teamMembers.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-orange-500">
          <tr>
            <th class="px-6 py-3 text-left text-white text-sm font-medium">Nombre</th>
            <th class="px-6 py-3 text-left text-white text-sm font-medium">Apellido</th>
            <th class="px-6 py-3 text-left text-white text-sm font-medium">N° documento</th>
            <th class="px-6 py-3 text-left text-white text-sm font-medium">Teléfono</th>
            <th class="px-6 py-3 text-left text-white text-sm font-medium">Correo</th>
            <th class="px-6 py-3 text-left text-white text-sm font-medium">Rol</th>
            <th class="px-6 py-3 text-center text-white text-sm font-medium">Editar</th>
            <th class="px-6 py-3 text-center text-white text-sm font-medium">Eliminar</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading && teamMembers.length" class="text-center opacity-50">
            <td colspan="8" class="px-6 py-4 italic">Actualizando lista...</td>
          </tr>
          <tr v-if="!loading && paginatedMembers.length === 0" class="text-center">
            <td colspan="8" class="px-6 py-4 text-gray-500">
              {{ searchQuery && filteredMembers.length === 0 ? 'No se encontraron resultados para "' + searchQuery + '"'
                : 'No hay empleados registrados.' }}
            </td>
          </tr>
          <tr v-for="member in paginatedMembers" :key="member.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap flex items-center">
              <UserCircleIcon class="w-6 h-6 text-gray-400 mr-2" />
              <span class="text-gray-800">{{ member.firstName }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.lastName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.document }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800">{{ member.role }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <PencilIcon @click="openModalForEdit(member)"
                class="w-5 h-5 text-blue-500 hover:text-blue-700 cursor-pointer inline-block" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <TrashIcon @click="confirmAndRemoveMember(member)"
                class="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer inline-block" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINACIÓN (asumo que ya lo tienes y funciona con usePaginacion) -->
    <div v-if="!loading && totalPages > 0" class="flex items-center justify-between mt-6">
      <div class="flex items-center">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-3 py-1 rounded-l-lg border bg-white hover:bg-gray-100 disabled:opacity-50">‹</button>
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
          class="px-3 py-1 border-t border-b bg-white hover:bg-gray-100"
          :class="{ 'bg-orange-500 text-white': page === currentPage }">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0"
          class="px-3 py-1 rounded-r-lg border bg-white hover:bg-gray-100 disabled:opacity-50">›</button>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700">Registros por página</span>
        <select v-model.number="pageSize"
          class="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-200">
          <option v-for="size in [5, 7, 10, 20]" :key="size" :value="size">{{ size }}</option>
        </select>
      </div>
    </div>

    <!-- MODAL -->
    <NuevoEmpleadoModal :visible="isModalOpen" :member-to-edit="selectedMember" @close="closeModal"
      @saved="onModalSaveSuccess" @deleted="onModalDeleteSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Para el avatar del usuario
import type { TeamMember } from '@/core/entities/TeamMember';

// Composables
import { useTeamManagement } from '@/modules/admin/composables/useTeamManagement';
import { usePaginacion } from '@/modules/admin/composables/usePaginacion';   // Ajusta la ruta

// Icons
import {
  MagnifyingGlassIcon as SearchIcon,
  BellIcon,
  UserCircleIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';

// Componente Modal
import NuevoEmpleadoModal from '@/modules/admin/components/team/NuevoEmpleadoModal.vue';

// --- Autenticación y UI ---
const auth = useAuthStore();
const userAvatar = computed(() => (auth.user && 'avatar' in auth.user ? (auth.user as any).avatar : 'https://i.pravatar.cc/40'));

// --- Gestión de Miembros del Equipo (usando el nuevo composable) ---
const {
  teamMembers,      // Lista de todos los miembros
  loading,          // Estado de carga para operaciones del composable
  error,            // Errores del composable
  fetchAllTeamMembers,
  deleteTeamMember  // Para eliminar directamente desde la tabla
} = useTeamManagement();

// --- Estado del Modal ---
const isModalOpen = ref(false);
const selectedMember = ref<TeamMember | null>(null); // Miembro para editar o null para crear

// --- Búsqueda ---
const searchQuery = ref('');
const filteredMembers = computed(() => {
  if (!searchQuery.value) {
    return teamMembers.value; // Usa la lista completa del composable
  }
  const query = searchQuery.value.toLowerCase();
  return teamMembers.value.filter(m =>
    Object.values(m).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(query)
    )
  );
});

// --- Paginación ---
const {
  currentPage,
  pageSize,
  totalPages,
  paginatedItems: paginatedMembers, // Renombrado para usar en el template
  nextPage,
  prevPage,
  goToPage
} = usePaginacion<TeamMember>(() => filteredMembers.value); // Paginación sobre los miembros filtrados

// --- Ciclo de Vida ---
onMounted(() => {
  fetchAllTeamMembers(); // Carga inicial de datos
});

// --- Funciones del Modal ---
const openModalForCreate = () => {
  selectedMember.value = null; // Asegura que es modo creación
  isModalOpen.value = true;
};

const openModalForEdit = (member: TeamMember) => {
  selectedMember.value = { ...member }; // Pasa una copia para editar
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedMember.value = null; // Limpia el miembro seleccionado
};

const onModalSaveSuccess = async () => {
  closeModal();
  await fetchAllTeamMembers(); // Recarga la lista después de guardar/actualizar
  // Podrías añadir una notificación de éxito aquí (Toast, etc.)
  console.log('Empleado guardado/actualizado exitosamente.');
};

const onModalDeleteSuccess = async () => {
  closeModal();
  await fetchAllTeamMembers(); // Recarga la lista después de eliminar desde el modal
  console.log('Empleado eliminado exitosamente desde el modal.');
};

// --- Eliminar Directamente desde la Tabla ---
const confirmAndRemoveMember = async (member: TeamMember) => {
  if (confirm(`¿Estás seguro de que quieres eliminar a ${member.firstName} ${member.lastName}? Esta acción no se puede deshacer.`)) {
    try {
      await deleteTeamMember(member.id); // Llama a la función del composable
      await fetchAllTeamMembers(); // Recarga la lista
      console.log(`Empleado ${member.id} eliminado exitosamente.`);
      // Notificación de éxito
    } catch (err) {
      console.error(`Error al eliminar empleado ${member.id}:`, err);
      alert(`Error al eliminar: ${error.value || (err as Error).message}`);
      // Notificación de error
    }
  }
};

// Opcional: Observar errores globales del composable
watch(error, (newError) => {
  if (newError) {
    // Manejar el error, e.g., mostrar un toast global
    console.error("Error global de TeamManagement:", newError);
  }
});
</script>
