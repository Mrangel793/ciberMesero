<template>

        <div class="p-6 min-h-screen bg-[#F9EBD9] space-y-6">
            <!-- 1) HEADER -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 class="text-3xl font-bold text-orange-600">PROMOCIONES</h1>
                <div class="flex items-center space-x-4">
                    <!-- Buscador -->
                    <div class="relative">
                        <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input v-model="searchQuery" type="text" placeholder="Buscar..."
                            class="pl-10 pr-4 py-2 w-48 sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    </div>
                    <!-- Fecha -->
                    <input v-model="selectedDate" type="date"
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    <!-- Campana y avatar -->
                    <BellIcon class="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                    <!-- <img :src="user.avatar" alt="avatar" class="w-8 h-8 rounded-full object-cover"/> -->
                    <!-- Botón Agregar -->
                    <button @click="addPromotion"
                        class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                        Agregar
                    </button>
                </div>
            </div>

            <!-- 2) GRID DE PROMOCIONES -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="promo in filteredPromotions" :key="promo.id"
                    class="relative bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col">
                    <!-- Icono de eliminar -->
                    <button @click="deletePromotion(promo.id)"
                        class="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                        <TrashIcon class="w-5 h-5" />
                    </button>

                    <!-- Imagen + título -->
                    <div class="flex items-center mb-4 space-x-3">
                        <img v-if="promo.imageUrl" :src="promo.imageUrl" alt="logo" class="w-12 h-12 object-cover rounded" />
                        <div v-else class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                            <span class="text-xs">Sin img</span>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">{{ promo.title }}</h2>
                    </div>

                    <!-- Descripción -->
                    <p class="text-sm text-gray-700 flex-1">{{ promo.description }}</p>


                    <!-- Precio -->
                    <p class="mt-3 text-red-600 font-semibold">${{ promo.price }}</p>

                    <!-- Fecha límite -->
                    <p class="text-xs text-gray-400 mb-4">Válido hasta: {{ formatDate(promo.endDate) }}</p>

                    <!-- Botón editar -->
                    <button @click="editPromotion(promo.id)"
                        class="mt-auto bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                        Editar
                    </button>
                </div>
            </div>
            <!-- Aquí inyectamos la modal -->
            <NuevaPromocionModal
                :visible="showModal"
                :promotionToEdit="promotionToEdit"
                @close="closeModal"
                @saved="handleSaved" />
        </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NuevaPromocionModal from '../components/promotions/NuevaPromocionModal.vue'
import {
    MagnifyingGlassIcon as SearchIcon,
    BellIcon,
    TrashIcon
} from '@heroicons/vue/24/outline'
import { usePromotionManagement } from '@/modules/admin/composables/usePromotionManagement';
import type { Promotion } from '@/core/entities/Promotion';


/** Datos de usuario (ejemplo: avatar viene del store) */
const auth = useAuthStore()

// Ref que controla la modal
const showModal = ref(false)
const promotionToEdit = ref<Promotion | null>(null)

/** Controles de búsqueda y filtros */
const searchQuery = ref('')
const selectedRestaurant = ref('')
const selectedDate = ref<string | null>(null)

/** Lista dinámica de promociones desde la API */
const { promotions, loading, error, fetchAllPromotions, removePromotion } = usePromotionManagement();
onMounted(() => {
  fetchAllPromotions();
});

/** Filtrado reactivo */
const filteredPromotions = computed(() => {
    if (!promotions.value) return [];
    return promotions.value.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesDate = !selectedDate.value || p.endDate === selectedDate.value;
        return matchesSearch && matchesDate;
    });
});




function addPromotion() {
    promotionToEdit.value = null;
    showModal.value = true;
}

function editPromotion(id: string) {
    const promo = promotions.value.find(p => p.id === id);
    if (promo) {
        promotionToEdit.value = promo;
        showModal.value = true;
    }
}

async function deletePromotion(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta promoción?')) return;

    try {
        await removePromotion(id);
        await fetchAllPromotions();
        alert('Promoción eliminada correctamente');
    } catch (e) {
        alert(`Error al eliminar: ${(e as Error).message}`);
    }
}

function closeModal() {
    showModal.value = false;
    promotionToEdit.value = null;
}

async function handleSaved() {
    await fetchAllPromotions();
    alert('¡Promoción guardada con éxito!');
}

/** Formatea 'YYYY-MM-DD' a 'DD/MM/YYYY' */
function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString('es-CO')
}
</script>
