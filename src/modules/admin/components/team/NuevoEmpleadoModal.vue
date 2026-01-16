<template>
  <transition name="fade">
    <div v-if="props.visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
        <!-- Botón cerrar -->
        <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Título -->
        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-6">
          {{ isEditMode ? 'EDITAR EMPLEADO/A' : 'NUEVO EMPLEADO/A' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          <!-- Nombre -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Nombre <span
                class="text-red-500">*</span></label>
            <input id="firstName" v-model="form.firstName" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <!-- Apellido -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Apellido <span
                class="text-red-500">*</span></label>
            <input id="lastName" v-model="form.lastName" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <!-- Documento -->
          <div>
            <label for="document" class="block text-sm font-medium text-gray-700 mb-1">N° de documento <span
                class="text-red-500">*</span></label>
            <input id="document" v-model="form.document" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <!-- Teléfono -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono <span
                class="text-red-500">*</span></label>
            <input id="phone" v-model="form.phone" type="tel"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <!-- Email -->
          <div class="sm:col-span-2">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico <span
                class="text-red-500">*</span></label>
            <input id="email" v-model="form.email" type="email"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <!-- Rol -->
          <div class="sm:col-span-2">
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Rol <span
                class="text-red-500">*</span></label>
            <select id="role" v-model="form.role"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required>
              <option value="" disabled>Seleccione un rol...</option>
              <option v-for="r in availableRoles" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>

          <!-- Información de emergencia -->
          <div class="col-span-full mt-3">
            <span class="text-base font-medium text-gray-800">Información de Emergencia</span>
            <hr class="my-1">
          </div>
          <div>
            <label for="emergencyName" class="block text-sm font-medium text-gray-700 mb-1">Nombre del contacto</label>
            <input id="emergencyName" v-model="form.emergencyContact.name" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label for="emergencyEmail" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input id="emergencyEmail" v-model="form.emergencyContact.email" type="email"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div class="sm:col-span-2">
            <label for="emergencyPhone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input id="emergencyPhone" v-model="form.emergencyContact.phone" type="tel"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" />
          </div>

          <!-- Mensaje de error del formulario -->
          <div v-if="formErrorMessage" class="col-span-full text-red-500 text-sm text-center mt-2">
            {{ formErrorMessage }}
          </div>

          <!-- Botones -->
          <div class="col-span-full flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
            <button type="button" @click="close"
              class="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition order-3 sm:order-1">
              Cancelar
            </button>

            <button type="submit" :disabled="isSubmitting"
              class="w-full sm:w-auto bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 order-1 sm:order-3">
              {{ isSubmittingSave ? 'Guardando...' : (isEditMode ? 'Actualizar Cambios' : 'Guardar Empleado') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import { useTeamManagement } from '../../composables/useTeamManagement';
import type { TeamMember } from '@/core/entities/TeamMember';

const props = defineProps<{
  visible: boolean;
  memberToEdit?: TeamMember | null; // El miembro a editar, o null si es creación
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;   // Emitido después de crear o actualizar exitosamente
  (e: 'deleted'): void; // Emitido después de eliminar exitosamente
}>();

// --- Composable de Gestión ---
const {
  crearEmpleado,
  updateTeamMember,
} = useTeamManagement();

// --- Estado del Formulario ---
const availableRoles = ref(['Cocina', 'Mesero']);

const getInitialFormState = (): Omit<TeamMember, 'id'> => ({
  firstName: '',
  lastName: '',
  document: '',
  phone: '',
  email: '',
  role: '',
  emergencyContact: { name: '', email: '', phone: '' },
});

const form = reactive(getInitialFormState());
const currentEditingId = ref<string | null>(null); // Para guardar el ID en modo edición

const isEditMode = computed(() => !!props.memberToEdit && !!props.memberToEdit.id);

// --- Estado de Carga y Errores del Formulario ---
const isSubmittingSave = ref(false);
const isSubmittingDelete = ref(false);
const isSubmitting = computed(() => isSubmittingSave.value || isSubmittingDelete.value);
const formErrorMessage = ref<string | null>(null);

// --- Observador para popular el formulario en modo edición ---
watch(() => props.memberToEdit, (newMember) => {
  formErrorMessage.value = null; // Limpiar error al cambiar
  if (newMember && newMember.id) {
    currentEditingId.value = newMember.id;
    // Copiar todas las propiedades excepto 'id'
    const dataToEdit = { ...newMember };
    delete (dataToEdit as any).id;
    Object.assign(form, dataToEdit);
  } else {
    currentEditingId.value = null;
    Object.assign(form, getInitialFormState()); // Resetear para creación
  }
}, { immediate: true, deep: true }); // deep: true es importante para el objeto anidado emergencyContact

// --- Manejadores de Eventos ---
const close = () => {
  emit('close');
  // El watch ya resetea el form cuando memberToEdit se vuelve null al cerrar desde el padre
};

const handleSubmit = async () => {
  formErrorMessage.value = null;
  if (!form.firstName || !form.lastName || !form.email || !form.role || !form.document || !form.phone) {
    formErrorMessage.value = "Por favor, complete todos los campos obligatorios (*).";
    return;
  }

  isSubmittingSave.value = true;
  try {
    const payload: Omit<TeamMember, 'id'> = {
      firstName: form.firstName,
      lastName: form.lastName,
      document: form.document,
      phone: form.phone,
      email: form.email,
      role: form.role,
      emergencyContact: { ...form.emergencyContact },
    };

    if (isEditMode.value && currentEditingId.value) {
      await updateTeamMember(currentEditingId.value, payload);
    } else {
      await crearEmpleado(payload);
    }
    emit('saved'); // Notifica al padre
    close();        // Cierra el modal
  } catch (err) {
    console.error("Error al guardar empleado:", err);
    formErrorMessage.value = (err as Error).message || "Ocurrió un error inesperado al guardar.";
  } finally {
    isSubmittingSave.value = false;
  }
};

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilo para scrollbar si es necesario */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #fb923c;
  /* Naranja Tailwind */
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #fed7aa;
  /* Naranja claro Tailwind */
}
</style>
