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
                    <!-- Filtro de restaurante -->
                    <select v-model="selectedRestaurant"
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200">
                        <option value="">Filtrar por restaurante</option>
                        <option v-for="r in restaurants" :key="r" :value="r">{{ r }}</option>
                    </select>
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

                    <!-- Logo + título -->
                    <div class="flex items-center mb-4 space-x-3">
                        <img :src="promo.logo" alt="logo" class="w-12 h-12 object-cover rounded" />
                        <h2 class="text-lg font-semibold text-gray-800">{{ promo.title }}</h2>
                    </div>

                    <!-- Descripción -->
                    <p class="text-sm text-gray-700 flex-1">{{ promo.description }}</p>

                    <!-- Datos -->
                    <div class="mt-4 space-y-1 text-sm text-gray-600">
                        <p><span class="font-medium">Dirección:</span> {{ promo.address }}</p>
                        <p><span class="font-medium">Teléfono:</span> {{ promo.phone }}</p>
                    </div>

                    <!-- Precio -->
                    <p class="mt-3 text-red-600 font-semibold">{{ promo.price }}</p>

                    <!-- Fecha límite -->
                    <p class="text-xs text-gray-400 mb-4">Fecha límite: {{ formatDate(promo.expiryIso) }}</p>

                    <!-- Botón editar -->
                    <button @click="editPromotion(promo.id)"
                        class="mt-auto bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                        Editar
                    </button>
                </div>
            </div>
            <!-- Aquí inyectamos la modal -->
            <NuevaPromocionModal :visible="showModal" @close="showModal = false" @create="handleCreate" />
        </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NuevaPromocionModal from '../components/promotions/NuevaPromocionModal.vue'
import {
    // SearchIcon,
    BellIcon,
    TrashIcon
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

/** Datos de usuario (ejemplo: avatar viene del store) */
const auth = useAuthStore()
const user = {
    // avatar: auth.user?.avatar || 'https://i.pravatar.cc/40'
}

// Ref que controla la modal
const showModal = ref(false)

/** Controles de búsqueda y filtros */
const searchQuery = ref('')
const selectedRestaurant = ref('')
const selectedDate = ref<string | null>(null)
const restaurants = ref<string[]>([
    'McDonalds',
    'Burger King',
    'Pizza House'
])

/** Lista dinámica de promociones (normalmente vendría de tu API) */
const promotions = ref([
    {
        id: 1,
        title: '¡Combo Especial por Tiempo Limitado!',
        description: 'Disfruta de tu combo favorito con hamburguesa, papas y bebida a un precio increíble. ¡Aprovecha, la oferta es por tiempo limitado!',
        logo: '@/assets/logos/mcdonalds.png',
        price: '$20.000',
        address: 'Cra. 36 #44-73-95, Bucaramanga, Norte de Santander',
        phone: '3202243903',
        expiryIso: '2025-02-04',
        restaurant: 'McDonalds'
    }
    // … aquí más promociones …
])

/** Filtrado reactivo */
const filteredPromotions = computed(() =>
    promotions.value.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesRestaurant = !selectedRestaurant.value || p.restaurant === selectedRestaurant.value
        const matchesDate = !selectedDate.value || p.expiryIso === selectedDate.value
        return matchesSearch && matchesRestaurant && matchesDate
    })
)

const router = useRouter()
function addPromotion() {
    showModal.value = true;
}
function editPromotion(id: number) {
    router.push(`/promociones/${id}/editar`)
}
function deletePromotion(id: number) {
    promotions.value = promotions.value.filter(p => p.id !== id)
}

/** Formatea 'YYYY-MM-DD' a 'DD/MM/YYYY' */
function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString('es-CO')
}

// Cuando la modal dispara 'create', haces tu lógica de crear en el backend
function handleCreate(payload: any) {
    console.log('Crear promo', payload)
    // por ejemplo: promotions.value.push({ id: nextId, ...payload })
}
</script>
