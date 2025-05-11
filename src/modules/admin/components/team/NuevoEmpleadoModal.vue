<template>
  <transition name="fade">
    <div v-if="props.visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-2xl w-full mx-4 p-6 relative">
        <!-- Botón cerrar -->
        <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Título -->
        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-6">
          NUEVO EMPLEADO/A
        </h2>

        <form @submit.prevent="onSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Nombre / Apellido -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.firstName" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input v-model="form.lastName" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>

          <!-- Documento / Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
            <input v-model="form.document" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.phone" type="tel"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>

          <!-- Email / Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input v-model="form.email" type="email"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select v-model="form.role"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required>
              <option value="" disabled>Seleccione...</option>
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>

          <!-- Información de emergencia - Encabezado full width -->
          <div class="col-span-full">
            <span class="text-sm font-medium text-gray-700">Información de emergencia</span>
          </div>

          <!-- Nombre del contacto / Teléfono de contacto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del contacto</label>
            <input v-model="form.emergencyContact.name" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input v-model="form.emergencyContact.email" type="email"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" />
          </div>

          <!-- Teléfono de emergencia full width en móvil? En grid ocupa dos columnas -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.emergencyContact.phone" type="tel"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" />
          </div>

          <!-- Botón Guardar full width -->
          <div class="col-span-full text-center mt-4">
            <button type="submit" :disabled="loading"
              class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50">
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>

          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCrearEmpleado } from '@/modules/admin/composables/useCrearEmpleado'
import type { TeamMember } from '@/core/interfaces/TeamMember'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: TeamMember): void
}>()

const roles = ref(['Cocina', 'Mesero', 'Cliente'])

const form = reactive<TeamMember>({
  id: Date.now(), // Puedes dejar que Firestore genere el ID si prefieres
  firstName: '',
  lastName: '',
  document: '',
  phone: '',
  email: '',
  role: '',
  emergencyContact: {
    name: '',
    email: '',
    phone: ''
  }
});


const { crearEmpleado, loading, error } = useCrearEmpleado()

async function onSubmit() {
  const empleado: TeamMember = {
    ...form,
    // puedes integrar campos de emergencia en otro campo si tu modelo lo requiere
    // emergencyContact: { ...emergencyContact } ← si agregas esto al modelo
  }

  await crearEmpleado(empleado)
  if (!error.value) {
    emit('save', empleado)
    emit('close')
  }
}
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
