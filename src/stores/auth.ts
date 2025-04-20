/**
 * src/stores/auth.ts
 *
 * Store de autenticación y autorización global de la aplicación.
 *
 * - Guarda la información del usuario logueado (nombre y rol).
 * - Permite conocer el estado de sesión en cualquier componente.
 * - Facilita el control de acceso a rutas y elementos de UI según el rol.
 * - Métodos:
 *     • login(payload: User): almacena los datos del usuario tras el login.
 *     • logout(): limpia la sesión del usuario.
 *
 * Ejemplo de uso:
 *   const auth = useAuthStore();
 *   if (auth.user?.role === 'admin') { ... }
 */

import { defineStore } from 'pinia';
import type { AuthenticatedUser } from '@/modules/auth/interfaces/AuthenticatedUser';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthenticatedUser | null
  }),
  actions: {
    login(payload: AuthenticatedUser) {
      this.user = payload
    },
    logout() {
      this.user = null
    }
  }
})


