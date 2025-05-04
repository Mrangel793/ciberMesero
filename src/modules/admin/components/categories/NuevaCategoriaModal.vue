<template>
  <transition name="fade">
    <div v-if="props.visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-sm w-full mx-4 p-6 relative">
        <!-- Botón cerrar -->
        <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Título -->
        <h2 class="text-xl font-semibold text-center mb-6">NUEVA CATEGORÍA</h2>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.name" type="text" placeholder="Nombre de categoría"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200" required />
          </div>

          <!-- Botón Guardar -->
          <div class="text-center mt-4">
            <button type="submit" class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
              Guardar
            </button>
          </div>
          <!-- Alertas -->
          <div v-if="success" class="bg-green-100 text-green-800 px-4 py-2 rounded text-center">
            {{ success }}
          </div>
          <div v-if="error" class="bg-red-100 text-red-800 px-4 py-2 rounded text-center">
            {{ error }}
          </div>

        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useCrearCategoria } from '../../composables/useCrearCategoria';

// Props y eventos
const { crearCategoria, success, error } = useCrearCategoria();

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: { name: string }): void
}>()

// Estado del formulario
const form = reactive({ name: '' })


function onSubmit() {
  if (form.name.trim()) {
  crearCategoria(form.name.trim())
  emit('close')
}

}
// ✅ Limpiar alertas automáticamente después de 3 segundos
watch(success, (val) => {
  if (val) setTimeout(() => (success.value = ''), 3000)
})
watch(error, (val) => {
  if (val) setTimeout(() => (error.value = ''), 3000)
})
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
