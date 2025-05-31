<template>

    <div class="p-6 min-h-screen bg-[#F9EBD9] space-y-6">
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-3xl font-bold text-orange-600">
          MENÚ - {{ selectedRestaurant || 'Todos los restaurantes' }}
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
          <button @click="addItem" class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
            Agregar
          </button>
        </div>
      </div>

      <!-- loading -->
      <div v-if="loading" class="text-center py-8 text-gray-600">
        Cargando platos del menú...
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-100 text-red-700 px-4 py-2 rounded text-center">
        {{ error }}
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
            <img v-if="item.imageUrl" :src="item.imageUrl" alt="Imagen del platillo" class="object-cover w-full h-full" />
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
      <!-- Modal de crear plato-->
      <NuevoPlatilloModal :visible="showNewDishModal" @close="showNewDishModal = false" @create="handleCreateDish" />

      <!-- Modal de Importación -->
      <ImportMenuModal :visible="showImportModal" @close="showImportModal = false" @import="handleImport" />
    </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NuevoPlatilloModal from '../components/menu/NuevoPlatilloModal.vue';
import ImportMenuModal from '../components/menu/ImportMenuModal.vue';
import { useObtenerPlatos } from '../composables/useObtenerPlatos';

const searchQuery = ref('');
const selectedRestaurant = ref('');
const selectedCategory = ref('');
const showNewDishModal = ref(false);
const showImportModal = ref(false);

// Composable de platos
const { platos, loading, error, cargarPlatos } = useObtenerPlatos();

// Cargar platos al montar la vista
onMounted(() => {
  cargarPlatos();
});

// Filtro
const filteredMenuItems = computed(() =>
  platos.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    //const matchesRest = !selectedRestaurant.value || item.restaurant === selectedRestaurant.value;
    const matchesCat = !selectedCategory.value || item.category === selectedCategory.value;
    return matchesSearch && matchesCat;
  })
);

// Datos simulados (puedes actualizar desde store o API si lo deseas)
const restaurants = ref(['Los fugitivos']);
const categories = ref(['Entradas', 'Hamburguesas', 'Bebidas']);

const router = useRouter();
function importMenu() {
  showImportModal.value = true;
}
function addItem() {
  showNewDishModal.value = true;
}
function editItem(id: string) {
  router.push(`/menu/${id}/editar`);
}
function handleCreateDish() {
  console.log('Evento "create" del modal de platillo recibido. Refrescando platos...');
  showNewDishModal.value = false;
  cargarPlatos(); // Refresca la lista de platos
}
function handleImport(file: File) {
  console.log('Importando archivo:', file);
  cargarPlatos();
}
</script>
