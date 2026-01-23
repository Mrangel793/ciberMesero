import { auth } from '@/data/firebase/firebaseConfig';
import { onAuthStateChanged, type User } from 'firebase/auth';

/**
 * Servicio de autenticación para gestionar tokens y estado
 */
export const authService = {
  /**
   * Obtiene el token ID actual del usuario.
   * Si forceRefresh es true, fuerza la obtención de un nuevo token.
   */
  async getCurrentToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(forceRefresh);
  },

  /**
   * Obtiene el usuario actual de forma síncrona si ya está inicializado
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },
  
  /**
   * Inicializa el listener de estado de autenticación
   * Retorna una promesa que se resuelve cuando se determina el estado inicial
   */
  initAuth(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Solo necesitamos saber el estado inicial una vez para esta función
        resolve(user);
      });
    });
  }
};
