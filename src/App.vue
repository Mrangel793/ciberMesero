<template>
  <div class="w-full min-h-screen">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

// Inicializar el estado de autenticación al cargar la aplicación
onMounted(async () => {
  await authStore.initializeAuth();
});
</script>