<template>
  <div class="w-full min-h-screen">
    <LandingView />
    <!-- <LoginView /> -->
  </div>
</template>


<script setup lang="ts">
import LandingView from './modules/home/pages/LandingView.vue';
import LoginView from './modules/auth/pages/LoginView.vue';
import RegisterView from './modules/auth/pages/RegisterView.vue';
import { RouterLink, RouterView } from 'vue-router'
</script>