<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="flex">
    <SideBar />
    <main class="flex-1 p-6 bg-[#F9EBD9] min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/modules/auth/components/Sidebar.vue'
</script>
