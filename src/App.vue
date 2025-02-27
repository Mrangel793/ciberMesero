<template>
  <div class="w-full min-h-screen">
    <LandingView />
    <!-- <LoginView /> -->
    <!-- <RegisterView /> -->
    <!-- <ForgotPassword/> -->
    <!-- <ContactView/> -->
  </div>
</template>


<script setup lang="ts">
import LandingView from './modules/home/pages/LandingView.vue';
import LoginView from './modules/auth/pages/LoginView.vue';
import RegisterView from './modules/auth/pages/RegisterView.vue';
import ForgotPassword from './modules/auth/pages/ForgotPassword.vue';
import ContactView from './modules/home/pages/ContactView.vue';
import { RouterLink, RouterView } from 'vue-router'
</script>