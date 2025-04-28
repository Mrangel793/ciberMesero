<template>
    <Sidebar>
        <div class="p-6 min-h-screen bg-[#F9EBD9] space-y-6">
            <!-- HEADER -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 class="text-3xl font-bold text-orange-600">
                    MENÚ - {{ restaurantName }}
                </h1>
                <div class="flex flex-1 md:flex-none items-center gap-4">
                    <!-- Buscador -->
                    <div class="relative flex-1 md:flex-none">
                        <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input v-model="searchQuery" type="text" placeholder="Buscar..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    </div>

                </div>
            </div>

            <!-- FILTROS -->
            <div class="flex flex-wrap items-end justify-between mb-6 gap-y-4">
                <div class="flex gap-12">
                    <!-- Filtro por restaurante -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por restaurante
                        </label>
                        <select v-model="selectedRestaurant"
                            class="block w-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200">
                            <option value="">Seleccione...</option>
                            <option v-for="r in restaurants" :key="r" :value="r">
                                {{ r }}
                            </option>
                        </select>
                    </div>

                    <!-- Filtro por categoría -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por categoría
                        </label>
                        <select v-model="selectedCategory"
                            class="block w-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200">
                            <option value="">Seleccione...</option>
                            <option v-for="c in categories" :key="c" :value="c">
                                {{ c }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Botones alineados a la derecha -->
                <div class="flex gap-4">
                    <button @click="importMenu"
                        class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                        Importar menú
                    </button>
                    <button @click="addItem"
                        class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                        Agregar
                    </button>
                </div>
            </div>

            <!-- GRID DE ITEMS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="item in filteredMenuItems" :key="item.id"
                    class="relative bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
                    <!-- Etiqueta PROMOCIÓN -->
                    <div v-if="item.onPromo"
                        class="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        Promoción
                    </div>

                    <!-- Imagen -->
                    <div class="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img v-if="item.image" :src="item.image" alt="Imagen del platillo"
                            class="object-cover w-full h-full" />
                        <div v-else class="text-gray-300">– sin imagen –</div>
                    </div>

                    <!-- Contenido -->
                    <div class="p-4 flex-1 flex flex-col">
                        <span class="text-xs font-medium text-green-600 mb-1">Disponible</span>
                        <h2 class="font-semibold text-gray-800 mb-1">{{ item.name }}</h2>

                        <!-- Precios -->
                        <div class="flex items-baseline gap-2 mb-2">
                            <span v-if="item.oldPrice" class="text-sm text-gray-400 line-through">
                                {{ item.oldPrice }}
                            </span>
                            <span class="text-lg font-bold text-red-600">{{ item.price }}</span>
                        </div>

                        <!-- Descripción -->
                        <ul class="text-sm text-gray-700 list-disc list-inside mb-4 flex-1">
                            <li v-for="(line, idx) in item.description" :key="idx">{{ line }}</li>
                        </ul>

                        <!-- Botón Editar -->
                        <button @click="editItem(item.id)"
                            class="mt-auto bg-orange-500 text-white text-sm py-2 rounded-lg hover:bg-orange-600 transition">
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Sidebar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from '@/modules/auth/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
//   import { SearchIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

// Usuario
const auth = useAuthStore()
const restaurantName = 'Los fugitivos'   // Podrías tomarlo de la ruta o store
//   const user = { avatar: auth.user?.avatar }

// Filtros
const searchQuery = ref('')
const selectedRestaurant = ref('')
const selectedCategory = ref('')
const restaurants = ref(['Los fugitivos', 'McDonalds', 'Burger King'])
const categories = ref(['Entradas', 'Hamburguesas', 'Bebidas'])

// Ejemplo de datos de menú (luego vendrán de tu API)
const menuItems = ref([
    {
        id: 1,
        name: 'Perro caliente',
        image: '@/assets/imagenes/perro-caliente.jpg',
        oldPrice: '$40.000',
        price: '$20.000',
        description: [
            '500 gramos de carne de ternera',
            'Pan artesanal recién horneado',
            'Tomate, lechuga, cebolla y doble queso cheddar'
        ],
        onPromo: true,
        restaurant: 'Los fugitivos',
        category: 'Hamburguesas'
    }
    // …más items…
])

// Filtrado reactivo
const filteredMenuItems = computed(() =>
    menuItems.value.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesRest = !selectedRestaurant.value || item.restaurant === selectedRestaurant.value
        const matchesCat = !selectedCategory.value || item.category === selectedCategory.value
        return matchesSearch && matchesRest && matchesCat
    })
)

const router = useRouter()
function importMenu() {
    router.push('/menu/importar')
}
function addItem() {
    router.push('/menu/nuevo')
}
function editItem(id: number) {
    router.push(`/menu/${id}/editar`)
}
</script>