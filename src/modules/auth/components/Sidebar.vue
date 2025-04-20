<template>
    <aside :class="[ isCollapsed ? 'w-16' : 'w-64', 'h-screen bg-white transition-all duration-300 flex flex-col' ]">
      <!-- toggle, avatar… -->
  
      <nav class="mt-8 flex-1 overflow-auto">
        <ul class="space-y-1">
          <li v-for="r in menuRoutes" :key="r.path">
            <router-link
              :to="r.path"
              class="flex items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <component :is="r.meta.icon" class="w-6 h-6 text-gray-600" />
              <span v-if="!isCollapsed" class="ml-3 text-gray-800">
                {{ r.meta.title }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
  
      <!-- logout… -->
    </aside>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const isCollapsed = ref(false)
  function toggle() { isCollapsed.value = !isCollapsed.value }
  
  const auth = useAuthStore()
  const router = useRouter()
  
  const menuRoutes = computed(() => {
    const role = auth.user?.role
    return router
      .getRoutes()                       // todas las rutas
      .filter(r =>
        r.meta.showInMenu === true &&    // marcadas para menú
        Array.isArray(r.meta.roles) &&
        r.meta.roles.includes(role)
      )
  })
  </script>
  