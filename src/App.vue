<template>
  <div class="w-full min-h-screen">
    <LandingView />
    <!-- <LoginView /> -->
  </div>
</template>


<script setup lang="ts">
import LandingView from './views/Auth/LandingView.vue';
import LoginView from './views/Auth/LoginView.vue'
import RegisterView from './views/Auth/RegisterView.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>