<template>

  <!-- Sidebar -->
  <aside v-if="auth.user?.role" :class="[
    isCollapsed ? 'w-20' : 'w-64',
    'h-screen bg-[#F9EBD9] transition-all duration-300 flex flex-col'
  ]">
    <!-- Header + Toggle -->
    <div class="flex items-center justify-between p-4">
      <h2 v-if="!isCollapsed" class="text-lg font-bold text-orange-600">Menú</h2>
      <button @click="toggle" class="p-1 rounded hover:bg-orange-100">
        <svg v-if="isCollapsed" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-orange-600" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Nav container -->
    <div class="flex-1 mx-2 mt-4 bg-white rounded-2xl overflow-hidden flex flex-col">
      <nav class="flex-1 overflow-auto">
        <ul class="p-2 space-y-1">
          <li v-for="r in menuRoutes" :key="r.path">
            <router-link :to="r.path" custom v-slot="{ navigate, isActive }">
              <div @click="navigate" :class="[
                'flex items-center p-2 rounded-lg transition',
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'group hover:bg-orange-50'
              ]">
                <component :is="icons[r.meta.icon as keyof typeof icons]" :class="[
                  'w-5 h-5 transition',
                  isActive ? 'text-white' : 'text-orange-500'
                ]" />
                <span v-if="!isCollapsed" :class="[
                  'ml-3 truncate transition',
                  isActive
                    ? 'text-white'
                    : 'group-hover:text-orange-600 text-gray-800'
                ]">
                  {{ r.meta.title }}
                </span>
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Logout button -->
    <div class="mx-4 my-4">
      <button @click="logout()" class="flex items-center w-full p-2 rounded-2xl bg-white hover:bg-orange-50 transition">
        <ArrowLeftOnRectangleIcon class="w-5 h-5 text-orange-500" />
        <span v-if="!isCollapsed" class="ml-3 text-gray-800">Cerrar sesión</span>
      </button>
    </div>
  </aside>


</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// import { adminMenu } from '@/modules/admin/menu/adminMenu'
import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/solid'

import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  TagIcon,
  BookOpenIcon,
  FolderOpenIcon,
} from '@heroicons/vue/24/solid'

const icons = {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  TagIcon,
  BookOpenIcon,
  FolderOpenIcon
}


const isCollapsed = ref(false)
const toggle = () => (isCollapsed.value = !isCollapsed.value)

const auth = useAuthStore()
const router = useRouter()

// const menuRoutes = computed(() => {
//   const role = auth.user?.role
//   if (!role) return []
//   return adminMenu.filter((route) => route.roles.includes(role))
// })
const menuRoutes = computed(() => {
  const role = auth.user?.role;
  if (!role) return [];
  
  return router.getRoutes().filter(r =>
    r.meta?.showInMenu !== false &&
    (r.meta?.roles as string[] | undefined)?.includes(role) &&
    r.path.startsWith('/admin')
  );
});
console.log('menuRoutes', menuRoutes.value)

async function logout() {
  await auth.logout()
  router.push('/')
}
</script>
