<template>
    <div class="flex min-h-screen bg-gray-50">
        <!-- Sidebar fijo -->
        <aside :class="[
            isCollapsed ? 'w-16' : 'w-64',
            'transition-all duration-300 bg-white border-r border-gray-200 flex flex-col'
        ]">
            <!-- Header del Sidebar -->
            <div class="p-4 flex justify-between items-center border-b border-gray-100">
                <span v-if="!isCollapsed" class="text-xl font-bold text-orange-600">Panel</span>
                <button @click="toggle" class="text-gray-500 hover:text-orange-500">
                    <svg v-if="isCollapsed" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <Sidebar />
        </aside>

        <!-- Contenido -->
        <main class="flex-1 p-6 overflow-auto">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Sidebar from '@/modules/auth/components/Sidebar.vue';

// Colapsar sidebar
const isCollapsed = ref(false);
const toggle = () => (isCollapsed.value = !isCollapsed.value);

// Autenticación
const auth = useAuthStore();
const role = computed(() => auth.user?.role || '');


</script>