import './assets/index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

async function startApp() {
  console.log("A. startApp INICIADO");
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  // Inicializa el store ANTES de usar el router
  const authStore = useAuthStore();
  console.log("B. A punto de llamar a await authStore.initAuthListener()");
  // Espera a que el listener de autenticación se haya ejecutado al menos una vez
  await authStore.initAuthListener();
  console.log("C. await authStore.initAuthListener() TERMINADO.");

  // Ahora es seguro usar el router, porque el estado 'authReady' es true
  app.use(router);
  app.mount('#app');
  console.log("D. App MONTADA.");
}

startApp(); // Llama a la función asíncrona para iniciar la app
