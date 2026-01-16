<template>
  <transition name="fade">
    <div v-if="props.visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 p-6 relative">
        <!-- Botón cerrar -->
        <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Título -->
        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-4">
          IMPORTAR MENÚ
        </h2>

        <!-- Instrucciones -->
        <p class="text-center text-gray-600 mb-6">
          Para cargar su menú, haga clic en ‘Cargar archivo’, seleccione o arrastre el documento y luego presione el
          botón ‘Importar’.
          Solo se permiten archivos Excel (.xlsx).
        </p>

        <!-- Zona de carga -->
        <label for="file"
          class="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-400 transition">
          <input id="file" type="file" accept=".xlsx" class="hidden" @change="onFileSelected" />
          <span class="text-gray-400">{{ fileName || 'Cargar archivo .xlsx' }}</span>
        </label>

        <!-- Alertas -->
        <div v-if="successMessage" class="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded text-center">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded text-center">
          {{ errorMessage }}
        </div>

        <!-- Botón Importar -->
        <div class="text-center mt-6">
          <button :disabled="!selectedFile" @click="onImport"
            class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Importar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useImportarPlatos } from '@/modules/admin/composables/useImportarPlatos'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'import', file: File): void
}>()

const selectedFile = ref<File | null>(null)
const fileName = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const { importar } = useImportarPlatos()
const auth = useAuthStore()


function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  selectedFile.value = file
  fileName.value = file ? file.name : ''
  successMessage.value = ''
  errorMessage.value = ''
}

async function onImport() {
  console.log(auth.user?.uid);
  if (!selectedFile.value || !auth.user?.uid) return

  const platos = await importar(selectedFile.value)

  if (platos.length > 0) {
    successMessage.value = '¡Menú importado correctamente!'
    emit('import', selectedFile.value)
  } else {
    errorMessage.value = 'No se importaron datos. Revisa el archivo.'
  }

  // Cierra automáticamente después de 2 segundos
  setTimeout(() => emit('close'), 2000)
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
