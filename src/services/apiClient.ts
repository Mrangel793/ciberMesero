import axios from 'axios';
import { auth } from '@/data/firebase/firebaseConfig';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Obtenemos el token, forzando refresh si es necesario
        // Firebase hace cache del token y lo refresca automáticamente, 
        // pero getIdToken() asegura obtener uno válido
        const token = await user.getIdToken();
        
        // DEBUG: Guardar token para pruebas manuales
        localStorage.setItem('debug_auth_token', token);
        console.log('🔑 Token actualizado (copiar para Postman):', token);

        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting auth token', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Si recibimos un 401, podríamos intentar algo o loguear
    // Por ahora solo retornamos el error
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - session might be expired');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
