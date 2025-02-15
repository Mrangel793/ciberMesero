import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase (obtenida desde la consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyATNPpyonWg2-tllzZwmQkMwcx2WcfT9Hk",
    authDomain: "cibermesero.firebaseapp.com",
    projectId: "cibermesero",
    storageBucket: "cibermesero.firebasestorage.app",
    messagingSenderId: "772133147421",
    appId: "1:772133147421:web:87f356ddb3e6a8d6c587f4",
    measurementId: "G-4L08EXWCQS"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Obtiene el servicio de Autenticación