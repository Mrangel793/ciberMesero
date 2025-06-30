<template>
  <transition name="fade">
    <div v-if="props.visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
        <!-- Close -->
        <button @click="$emit('close')" class="absolute top-4 right-4 text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Título Dinámico -->
        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-6">
          {{ isEditMode ? 'EDITAR PROMOCIÓN' : 'NUEVA PROMOCIÓN' }}
        </h2>

        <form @submit.prevent="onSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Imagen -->
          <div class="col-span-full">
            <label for="logo"
              class="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-400 transition">
              <input id="logo" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              <div v-if="!form.logoPreview" class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"
                  aria-hidden="true">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="mt-2 block text-sm font-medium text-gray-400">Cargar imagen</span>
              </div>
              <img v-else :src="form.logoPreview" alt="Preview"
                class="max-h-full max-w-full object-contain rounded-lg" />
            </label>
          </div>

          <!-- Título -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título <span
                class="text-red-500">*</span></label>
            <input v-model="form.title" type="text" class="w-full input-estilo" required />
          </div>
          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción <span
                class="text-red-500">*</span></label>
            <textarea v-model="form.description" rows="3" class="w-full input-estilo" required></textarea>
          </div>

          <!-- Restaurante -->
          <div
            v-if="isAdminUser">
            <label class="block text-sm font-medium text-gray-700 mb-1">Restaurante <span
                class="text-red-500">*</span></label>
            <select v-model="form.restaurantId" class="w-full input-estilo" required>
              <option value="" disabled>Seleccione...</option>
              <!-- CORREGIDO: Usa adminAvailableRestaurants -->
              <option v-for="r in adminAvailableRestaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
          </div>
          <div v-else-if="form.restaurantId">
            <label class="block text-sm font-medium text-gray-700 mb-1">Restaurante</label>
            <!-- Intenta encontrar el nombre del restaurante para mostrarlo -->
            <input type="text"
              :value="adminAvailableRestaurants.find(r => r.id === form.restaurantId)?.name || authStore.user?.name || 'Mi Restaurante'"
              class="w-full input-estilo bg-gray-100" disabled />
          </div>


          <!-- Dirección -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input v-model="form.address" type="text" class="w-full input-estilo" />
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.phone" type="tel" class="w-full input-estilo" />
          </div>
          <!-- Precio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio (Opcional)</label>
            <input v-model.number="form.price" type="number" step="0.01" class="w-full input-estilo"
              placeholder="Ej: 15000" />
          </div>

          <!-- Platillos -->
          <div class="col-span-full">
            <span class="block text-sm font-medium text-gray-700 mb-1">
              Seleccione los platillos <span class="text-red-500">*</span>
            </span>
            <div v-if="dishesLoading" class="text-gray-500">Cargando platillos...</div>
            <div v-else-if="!form.restaurantId" class="text-gray-500 italic">Seleccione un restaurante para ver los
              platillos.</div>
            <!-- CORREGIDO: Usa availableDishes -->
            <div v-else-if="availableDishes.length === 0" class="text-gray-500 italic">No hay platillos disponibles para
              este restaurante.</div>
            <div v-else class="max-h-40 overflow-y-auto border rounded p-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <!-- CORREGIDO: Usa availableDishes y form.selectedDishIds -->
              <label v-for="dish in availableDishes" :key="dish.id"
                class="inline-flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" :value="dish.id" v-model="form.selectedDishIds"
                  class="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                <span class="text-gray-700 text-sm">{{ dish.name }}</span>
              </label>
            </div>
          </div>

          <!-- Fecha inicio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio <span
                class="text-red-500">*</span></label>
            <input v-model="form.startDate" type="date" class="w-full input-estilo" required />
          </div>
          <!-- Fecha fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de fin <span
                class="text-red-500">*</span></label>
            <input v-model="form.endDate" type="date" class="w-full input-estilo" required />
          </div>

          <div v-if="formErrorMessage || promotionError" class="col-span-full text-red-500 text-sm text-center">
            {{ formErrorMessage || promotionError }} <!-- Muestra error del form o del composable -->
          </div>

          <!-- Botón Dinámico -->
          <div class="col-span-full text-center mt-4">
            <button type="submit" :disabled="promoLoading"
              class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50">
              {{ promoLoading ? 'Guardando...' : (isEditMode ? 'Actualizar Promoción' : 'Agregar Promoción') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePromotionManagement } from '../../composables/usePromotionManagement'; // Ajusta la ruta si es necesario
import type { CreatePromotionInput } from '@/core/usecases/promotion/CreatePromotionUseCase'; // Ajusta ruta
import type { UpdatePromotionInput } from '@/core/usecases/promotion/UpdatePromotionUseCase'; // Ajusta ruta

import type { Promotion } from '@/core/entities/Promotion'; // PromotionDish no es necesario importar aquí directamente
//import type { MenuItem } from '@/core/entities/MenuItem';
import { useDishManagement } from '../../composables/useDishManagement'; // Ajusta ruta si es necesario

const authStore = useAuthStore();

const {
  createPromotion,
  updatePromotion,
  loading: promoLoading, // Renombrado para evitar colisión si es necesario
  error: promotionError, // Error del composable de promociones
} = usePromotionManagement();

const {
  dishes: availableDishes, // CORREGIDO: Renombrado para claridad y consistencia
  fetchAllDishes,
  loading: dishesLoading
} = useDishManagement();

const props = defineProps<{
  visible: boolean;
  promotionToEdit?: Promotion | null;
}>();

// CORREGIDO: Nombre de la computed property
const isEditMode = computed(() => !!props.promotionToEdit && !!props.promotionToEdit.id);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const isAdminUser = computed(() => authStore.user?.role === 'admin');

// CORREGIDO: Nombre de la variable
const adminAvailableRestaurants = ref([
  { id: 'restaurante_uid_1', name: 'McDonalds (Admin)' }, // Nombres de ejemplo
  { id: 'restaurante_uid_2', name: 'Burger King (Admin)' },
  // Deberías cargar estos dinámicamente si el admin puede seleccionar de una lista de todos los restaurantes
]);

// Estas refs 'restaurantes' y 'platillos' ya no son necesarias si cargas dinámicamente
// const restaurantes = ref(['McDonalds', 'Burger King', 'Pizza House']);
// const platillos = ref(['Perro caliente', 'Hamburguesa', 'Mazorcada', 'Salchipierro']);

const form = reactive({
  logoFile: null as File | null,
  logoPreview: '',
  title: '',
  description: '',
  restaurantId: '',
  address: '',
  phone: '',
  price: undefined as number | undefined,
  selectedDishIds: [] as string[], // CONSISTENTE: v-model usa esto
  startDate: '',
  endDate: '',
  imageUrl: '', // Para guardar la URL existente en modo edición
});

const formErrorMessage = ref<string | null>(null);

watch(() => form.restaurantId, (newRestaurantId, oldRestaurantId) => {
  if (newRestaurantId && newRestaurantId !== '') {
    fetchAllDishes(newRestaurantId);
    if (oldRestaurantId && newRestaurantId !== oldRestaurantId && !isEditMode.value) { // Solo resetea si no estamos cargando para editar
        form.selectedDishIds = [];
    }
  } else {
    availableDishes.value = [];
    form.selectedDishIds = [];
  }
}, { immediate: true });


watch(() => props.promotionToEdit, (promo) => {
  formErrorMessage.value = null; // Limpiar errores al cambiar de modo o promoción
  if (promo && isEditMode.value) {
    console.log("Editando promoción:", promo);
    form.title = promo.title;
    form.description = promo.description;
    form.restaurantId = promo.restaurantId; // Esto disparará el watch de arriba para cargar platillos
    form.address = promo.address || '';
    form.phone = promo.phone || '';
    form.price = promo.price;
    form.startDate = promo.startDate;
    form.endDate = promo.endDate;
    form.logoPreview = promo.imageUrl || '';
    form.imageUrl = promo.imageUrl || '';
    form.selectedDishIds = promo.dishes.map(d => d.id);
    form.logoFile = null;
  } else {
    console.log("Creando nueva promoción o cerrando modal");
    form.title = '';
    form.description = '';
    form.restaurantId = isAdminUser.value ? '' : (authStore.user?.uid || '');
    form.address = '';
    form.phone = '';
    form.price = undefined;
    form.startDate = '';
    form.endDate = '';
    form.selectedDishIds = [];
    form.logoFile = null;
    form.logoPreview = '';
    form.imageUrl = '';
    // Si restaurantId se establece aquí, el watch de arriba cargará los platillos
    if (form.restaurantId) {
      fetchAllDishes(form.restaurantId);
    } else {
      availableDishes.value = []; // Asegura que se limpien si no hay restaurantId
    }
  }
}, { immediate: true });

onMounted(() => {
  // Si el modal es visible al montar y es para crear, y el usuario no es admin
  if (props.visible && !isEditMode.value && authStore.user && !isAdminUser.value) {
    const userRestaurantId = authStore.user.uid; // O la propiedad correcta para el ID del restaurante del usuario
    if (userRestaurantId) {
      form.restaurantId = userRestaurantId;
      // fetchAllDishes(userRestaurantId); // El watch de form.restaurantId ya se encarga de esto
    }
  }
});

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  form.logoFile = file;
  form.imageUrl = ''; // Limpia la URL existente si se carga un nuevo archivo, la preview se actualizará
  if (file) {
    const reader = new FileReader();
    reader.onload = () => { form.logoPreview = reader.result as string; };
    reader.readAsDataURL(file);
  } else {
    form.logoPreview = isEditMode.value ? (props.promotionToEdit?.imageUrl || '') : '';
  }
}

async function onSubmit() {
  formErrorMessage.value = null;
  if (promotionError.value) promotionError.value = null; // Limpiar error del composable

  if (!form.title.trim() || !form.description.trim() || !form.restaurantId || form.selectedDishIds.length === 0 || !form.startDate || !form.endDate) {
    formErrorMessage.value = "Por favor, complete todos los campos obligatorios (*).";
    return;
  }
  if (form.price !== undefined && (isNaN(form.price) || form.price < 0)) { // Chequea también isNaN para el precio
    formErrorMessage.value = "El precio debe ser un número positivo o estar vacío.";
    return;
  }
  const sDate = new Date(form.startDate);
  const eDate = new Date(form.endDate);
  if (eDate < sDate) {
    formErrorMessage.value = "La fecha de fin no puede ser anterior a la fecha de inicio.";
    return;
  }

  const targetRestaurantId = form.restaurantId; // Ya está establecido en el form.restaurantId

  if (isEditMode.value && props.promotionToEdit?.id) {
    const updatePayload: UpdatePromotionInput = {
      title: form.title,
      description: form.description,
      price: form.price,
      dishIds: form.selectedDishIds,
      startDate: form.startDate,
      endDate: form.endDate,
      address: form.address || undefined,
      phone: form.phone || undefined,
      // Si se seleccionó un nuevo archivo (form.logoFile), el composable lo subirá
      // y usará esa nueva URL. Si no, y form.imageUrl (la URL original o una nueva pegada)
      // es diferente a la original, se podría usar esa. Es mejor que el composable decida.
      // Si NO se seleccionó un nuevo archivo Y la preview/imageUrl NO cambió,
      // no envíes imageUrl para no actualizarlo innecesariamente.
      imageUrl: (form.logoFile || form.imageUrl !== props.promotionToEdit.imageUrl) ? (form.logoPreview || undefined) : undefined,
      // ^^^ Esta lógica para imageUrl en update es compleja. Es más simple pasar form.logoFile al composable
      // y si es null, pasar form.imageUrl. El composable decide si la URL cambió.
    };
    // Una lógica más simple para imageUrl en update:
    if (form.logoFile) { // Si hay nuevo archivo, el composable lo usa
      updatePayload.imageUrl = undefined; // Señal para usar el archivo
    } else { // Si no hay nuevo archivo, usa la URL actual del formulario
      updatePayload.imageUrl = form.imageUrl || undefined;
    }


    try {
      await updatePromotion(props.promotionToEdit.id, updatePayload, targetRestaurantId, form.logoFile);
      emit('saved');
      emit('close');
    } catch (e) {
      formErrorMessage.value = `Error al actualizar: ${(e as Error).message || promotionError.value}`;
    }
  } else {
    const createPayload: CreatePromotionInput = {
      title: form.title,
      description: form.description,
      price: form.price,
      dishIds: form.selectedDishIds,
      startDate: form.startDate,
      endDate: form.endDate,
      address: form.address || undefined,
      phone: form.phone || undefined,
      imageUrl: form.logoPreview || undefined, // O undefined y que el composable use form.logoFile
    };
    try {
      await createPromotion(targetRestaurantId, createPayload, form.logoFile);
      emit('saved');
      emit('close');
    } catch (e) {
      formErrorMessage.value = `Error al crear: ${(e as Error).message || promotionError.value}`;
    }
  }
}
</script>

<style scoped>
.input-estilo {
  @apply w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-200;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
