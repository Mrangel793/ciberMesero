<template>

      <div class="w-full h-full bg-[#F9EBD9] space-y-8">
        <!-- 1) HEADER: título, buscador, campana y avatar -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 class="text-3xl font-bold text-orange-600">PEDIDOS</h1>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <BellIcon class="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
            <img
              :src="user.avatar"
              alt="avatar"
              class="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>

        <!-- 2) FILTROS: restaurante y fecha -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Filtrar por restaurante</label>
            <select
              v-model="selectedRestaurant"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">Seleccione...</option>
              <option v-for="r in restaurants" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              v-model="selectedDate"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        <!-- 3) GRID DE TICKETS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-lg shadow border border-gray-200 p-4"
          >
            <!-- Cabecera del ticket -->
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center space-x-2">
                <span class="text-xl font-bold">{{ order.id }}</span>
                <h3 class="text-lg font-semibold">{{ order.restaurant }}</h3>
              </div>
              <span
                :class="order.paymentStatus === 'pago realizado'
                  ? 'text-green-600'
                  : 'text-red-600'"
                class="text-sm font-medium"
              >
                {{ order.paymentStatus }}
              </span>
            </div>

            <!-- Detalles -->
            <p class="text-sm text-gray-700">Fecha del pedido: {{ order.date }}</p>
            <p class="text-sm text-gray-700 mb-2">Hora: {{ order.time }}</p>
            <p class="text-sm text-gray-700">Cliente: {{ order.client }}</p>

            <!-- Productos -->
            <div class="mt-2">
              <span class="text-sm font-medium text-gray-800">Productos:</span>
              <ul class="ml-4 list-disc list-inside text-sm text-gray-700">
                <li v-for="prod in order.products" :key="prod.name">
                  {{ prod.name }}
                  <span class="float-right">{{ prod.qty }}</span>
                </li>
              </ul>
            </div>

            <!-- Total -->
            <div class="mt-2 flex justify-between">
              <span class="font-medium">Total</span>
              <span class="text-red-600 font-semibold">{{ order.total }}</span>
            </div>

            <!-- Observaciones -->
            <div class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones adicionales</label>
              <input
                v-model="order.notes"
                type="text"
                placeholder="Observaciones adicionales"
                class="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <!-- Tipo de pago -->
            <div class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de pago:</label>
              <select
                v-model="order.paymentType"
                class="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option>Efectivo</option>
                <option>Tarjeta</option>
              </select>
            </div>

            <!-- Estado del pedido -->
            <div class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado del pedido:</label>
              <input
                v-model="order.orderState"
                type="text"
                disabled
                class="w-full bg-gray-100 border border-gray-200 rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      </div>

  </template>

  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { BellIcon } from '@heroicons/vue/24/outline'

  const auth = useAuthStore()
  const user = {
    name: auth.user?.name || 'Usuario',
    avatar: auth.user?.avatar || 'https://i.pravatar.cc/40'
  }

  // Filtros
  const searchQuery = ref('')
  const selectedRestaurant = ref('')
  const selectedDate = ref<string | null>(null)
  const restaurants = ref<string[]>(['McDonalds', 'Burger King', 'Pizza House'])

  // Pedidos de ejemplo (luego traídos vía API)
  const orders = ref([
    {
      id: 4,
      restaurant: 'McDonalds',
      date: '25/01/2025',
      time: '5:10 p.m.',
      client: 'Juan David',
      products: [
        { name: 'Hamburguesa gourmet clásica', qty: 1 },
        { name: 'Hamburguesa gourmet', qty: 1 },
        { name: 'Perro gourmet clásica', qty: 1 }
      ],
      total: '150.000',
      paymentStatus: 'pago realizado',
      paymentType: 'Efectivo',
      orderState: 'Entregado',
      notes: ''
    }
  ])
  </script>
