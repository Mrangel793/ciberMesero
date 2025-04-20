<template>
    <div class="flex">
      <!-- Sidebar -->
      <aside
        v-if="auth.user?.role"
        :class="[
          isCollapsed ? 'w-16' : 'w-64',
          'h-screen bg-white transition-all duration-300 flex flex-col border-r border-gray-200'
        ]"
      >
        <!-- Header del sidebar -->
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <span v-if="!isCollapsed" class="text-lg font-bold text-orange-600">Menú</span>
          <button @click="toggle" class="text-gray-500 hover:text-orange-500">
            <svg v-if="isCollapsed" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
  
        <!-- Navegación -->
        <nav class="mt-4 flex-1 overflow-auto">
          <ul class="space-y-1 px-2">
            <li v-for="r in menuRoutes" :key="r.path">
              <router-link
                :to="r.path"
                class="flex items-center p-2 rounded hover:bg-orange-50 transition group"
                active-class="bg-orange-100"
              >
                <component :is="r.icon" class="w-5 h-5 text-orange-500" />
                <span
                  v-if="!isCollapsed"
                  class="ml-3 text-gray-800 group-hover:text-orange-600 transition"
                >
                  {{ r.title }}
                </span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
  
      <!-- Contenido principal -->
      <main class="flex-1 p-6 bg-gray-50 min-h-screen">
        <slot />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { adminMenu } from '@/modules/admin/menu/adminMenu';
  
  const isCollapsed = ref(false);
  function toggle() {
    isCollapsed.value = !isCollapsed.value;
  }
  
  const auth = useAuthStore();
  const router = useRouter();
  
  const menuRoutes = computed(() => {
    const role = auth.user?.role;
    if (!role) return [];
    return adminMenu.filter(route => route.roles.includes(role));
  });
  </script>
  