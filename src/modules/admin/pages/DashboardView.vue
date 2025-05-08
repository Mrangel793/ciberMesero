<template>
  <Sidebar>
    <div class="w-full h-full bg-[#F9EBD9] space-y-8">

      <!-- HEADER -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-orange-600">
          ¡BIENVENIDO/A DE NUEVO, {{ user.name }}!
        </h1>
        <div class="flex items-center space-x-4">
          <BellIcon class="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
          <!-- <img :src="user.avatar" alt="avatar" class="w-8 h-8 rounded-full object-cover"/> -->
        </div>
      </div>

      <!-- MÉTRICAS -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Entregados -->
        <div class="bg-white rounded-xl shadow p-4 flex items-center">
          <InboxIcon class="w-8 h-8 text-orange-500" />
          <div class="ml-4">
            <p class="text-sm text-gray-500">Pedidos entregados</p>
            <p class="text-xl font-semibold text-gray-800">{{ stats.delivered }}</p>
          </div>
        </div>
        <!-- Tiempo promedio -->
        <div class="bg-white rounded-xl shadow p-4 flex items-center">
          <ClockIcon class="w-8 h-8 text-orange-500" />
          <div class="ml-4">
            <p class="text-sm text-gray-500">Tiempo promedio</p>
            <p class="text-xl font-semibold text-gray-800">{{ stats.avgTime }}</p>
          </div>
        </div>
        <!-- Cancelados -->
        <div class="bg-white rounded-xl shadow p-4 flex items-center">
          <XCircleIcon class="w-8 h-8 text-orange-500" />
          <div class="ml-4">
            <p class="text-sm text-gray-500">Pedidos cancelados</p>
            <p class="text-xl font-semibold text-gray-800">{{ stats.cancelled }}</p>
          </div>
        </div>
      </div>

      <!-- GRÁFICOS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Total de pedidos -->
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-gray-800">Total de pedidos</h2>
            <select v-model="selectedRestaurant1" class="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="">Todos</option>
              <option v-for="r in restaurants" :key="r.name" :value="r.name">
                {{ r.name }}
              </option>
            </select>
          </div>
          <canvas id="ordersChart"></canvas>
        </div>

        <!-- Ingresos totales -->
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-gray-800">Ingresos totales</h2>
            <select v-model="selectedRestaurant2" class="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="">Todos</option>
              <option v-for="r in restaurants" :key="r.name" :value="r.name">
                {{ r.name }}
              </option>
            </select>
          </div>
          <canvas id="incomeChart"></canvas>
        </div>
      </div>

      <!-- RESTAURANTES + PANEL DERECHO -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Restaurantes más visitados -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
          <h3 class="font-semibold text-gray-800">Restaurantes más visitados</h3>
          <ul class="space-y-3">
            <li v-for="r in topRestaurants" :key="r.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img :src="r.logo" alt="logo" class="w-10 h-10 rounded" />
                <div>
                  <p class="font-medium text-gray-800">{{ r.name }}</p>
                  <p class="text-sm text-gray-500">{{ r.address }}</p>
                </div>
              </div>
              <span class="text-sm text-gray-600">{{ r.visits }} visitas</span>
            </li>
          </ul>
        </div>

        <!-- Promociones y Comentarios -->
        <div class="space-y-6">
          <!-- Promociones -->
          <div class="bg-white rounded-xl shadow p-4 space-y-3">
            <h3 class="font-semibold text-gray-800">Promociones</h3>
            <ul class="space-y-3">
              <li v-for="promo in promotions" :key="promo.id" class="flex items-center space-x-4">
                <img :src="promo.logo" alt="logo promo" class="w-12 h-12 rounded" />
                <div>
                  <p class="font-medium">{{ promo.title }}</p>
                  <p class="text-sm text-gray-500">{{ promo.description }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Comentarios -->
          <div class="bg-white rounded-xl shadow p-4 space-y-4">
            <h3 class="font-semibold text-gray-800">Comentarios</h3>
            <ul class="space-y-4">
              <li v-for="c in comments" :key="c.id" class="space-y-2">
                <div class="flex items-start space-x-3">
                  <img :src="c.avatar" alt="avatar comentario" class="w-8 h-8 rounded-full" />
                  <div>
                    <p class="font-medium text-gray-800">{{ c.user }}</p>
                    <p class="text-sm text-gray-500">{{ c.text }}</p>
                    <div class="flex mt-1 text-yellow-400">
                      <StarIcon v-for="n in c.rating" :key="n" class="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto';
import Sidebar from '@/modules/auth/components/Sidebar.vue';

import { useAuthStore } from '@/stores/auth'

// Heroicons
import {
  InboxIcon,
  ClockIcon,
  XCircleIcon,
  BellIcon,
  StarIcon
} from '@heroicons/vue/24/solid'


const auth = useAuthStore();
const ordersChartRef = ref<HTMLCanvasElement | null>(null);
const incomeChartRef = ref<HTMLCanvasElement | null>(null);

const user = {
  name: auth.user?.name || 'Usuario',
  // Si guardas avatar en tu store, úsalo. Sino usa un placeholder:
  // avatar: auth.user?.avatar || 'https://i.pravatar.cc/40'
}

// Datos estáticos de ejemplo (reemplázalos con tu API)
const stats = {
  delivered: 100,
  avgTime: '15 Min',
  cancelled: 2
}
const restaurants = ref([
  { name: 'McDonalds' },
  { name: 'Pizza house' }
])
const selectedRestaurant1 = ref('')
const selectedRestaurant2 = ref('')
const topRestaurants = ref([
  {
    name: 'McDonalds',
    address: 'Cra. 36 #44-73-95, Bucaramanga, Norte de Santander',
    visits: 250,
    logo: '@/assets/logos/mcdonalds.png'
  },
  {
    name: 'Pizza house',
    address: 'Cra. 36 #44-73-95, Bucaramanga, Norte de Santander',
    visits: 200,
    logo: '@/assets/logos/pizzahouse.png'
  }
])
const promotions = ref([
  {
    id: 1,
    title: '¡Combo Especial por Tiempo Limitado!',
    description: 'Disfruta de tu combo favorito con hamburguesa, papas y bebida...',
    logo: '@/assets/logos/mcdonalds.png'
  },
  {
    id: 2,
    title: '¡Combo Especial por Tiempo Limitado!',
    description: 'Disfruta de tu combo favorito con pizza, papas y bebida...',
    logo: '@/assets/logos/pizzahouse.png'
  }
])
const comments = ref([
  {
    id: 1,
    user: 'Juan David',
    avatar: '@/assets/avatars/user1.jpg',
    text: 'La comida estuvo buenísima y el servicio muy rápido. ¡Muy recomendable!',
    rating: 5
  },
  {
    id: 2,
    user: 'Sara Sofía',
    avatar: '@/assets/avatars/user2.jpg',
    text: 'El ambiente muy agradable, las papas podrían estar un poco más crujientes.',
    rating: 4
  },
  {
    id: 3,
    user: 'Nelson',
    avatar: '@/assets/avatars/user3.jpg',
    text: 'Buen sabor y rapidez, ¡volveré pronto!',
    rating: 5
  }
])

// Inicializar gráficos
onMounted(() => {

  if (ordersChartRef.value) {
    const ordersCtx = ordersChartRef.value.getContext('2d');
    if (ordersCtx) {
      new Chart(ordersCtx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [
            {
              label: 'Mensuales',
              data: [4, 2, 6, 0, 0],
              backgroundColor: 'rgba(59, 130, 246, 0.7)'
            },
            {
              label: 'Diaria',
              data: [1, 0, 0, 0, 0],
              backgroundColor: 'rgba(16, 185, 129, 0.7)'
            },
            {
              label: 'Semanales',
              data: [0, 0, 0, 0, 0],
              backgroundColor: 'rgba(234, 179, 8, 0.7)'
            }
          ]
        },
        options: { responsive: true }
      });
    }
  }

  if (incomeChartRef.value) {
    const incomeCtx = incomeChartRef.value.getContext('2d');
    if (incomeCtx) {
      new Chart(incomeCtx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [
            {
              label: 'Ingresos',
              data: [4, 0, 5, 0, 0],
              backgroundColor: 'rgba(249, 115, 22, 0.7)'
            }
          ]
        },
        options: { responsive: true }
      });
    }
  }
});

</script>
