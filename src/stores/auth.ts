/**
 * Store de autenticación usando arquitectura limpia
 * Gestiona el estado de autenticación del usuario
 */
import { defineStore } from 'pinia';
import type { AuthenticatedUser } from '@/core/entities/AuthenticatedUser';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/data/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { UserMapper } from '@/data/mappers';
import { UnauthorizedError, RepositoryError } from '@/core/errors';

interface AuthState {
  user: AuthenticatedUser | null;
  authReady: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    authReady: false,
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Obtiene los datos del usuario desde Firestore y los mapea a AuthenticatedUser
     */
    async fetchUser(firebaseUser: User): Promise<void> {
      try {
        console.log("Obteniendo datos de usuario para UID:", firebaseUser.uid);

        const docRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(docRef);

        if (userSnap.exists()) {
          // Usar mapper para convertir datos de Firestore
          this.user = UserMapper.toAuthenticatedUser(userSnap.data(), firebaseUser.uid);
          console.log("Usuario encontrado y mapeado correctamente");

          // DEBUG: Obtener y guardar token inmediatamente para pruebas manuales
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('debug_auth_token', token);
          console.log('🔑 Token de sesión actualizado (copiar para Postman):', token);

          // Persistir en memoria (Pinia)
          // this.persistAuthState(); // No es necesario con Firebase
        } else {
          console.warn(`No se encontró documento de usuario para UID: ${firebaseUser.uid}`);
          throw new UnauthorizedError('Usuario no encontrado en la base de datos');
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        this.user = null;

        if (error instanceof UnauthorizedError) {
          throw error;
        }
        throw new RepositoryError(
          'Error al obtener datos del usuario',
          'fetchUser',
          error as Error
        );
      }
    },

    /**
     * Inicializa el listener de autenticación de Firebase
     */
    initAuthListener(): Promise<void> {
      return new Promise<void>((resolve) => {
        console.log("Inicializando listener de autenticación");

        onAuthStateChanged(auth, async (firebaseUser) => {
          console.log("Estado de auth cambió. Usuario:", firebaseUser ? firebaseUser.uid : 'null');

          if (firebaseUser) {
            try {
              await this.fetchUser(firebaseUser);
            } catch (error) {
              console.error("Error al cargar usuario:", error);
              this.user = null;
              this.clearAuthState();
            }
          } else {
            this.user = null;
            this.clearAuthState();
          }

          if (!this.authReady) {
            this.authReady = true;
            console.log("Autenticación lista");
            resolve();
          }
        });
      });
    },

    /**
     * Establece el usuario autenticado manualmente
     */
    login(user: AuthenticatedUser): void {
      this.user = user;
      this.error = null;
      this.persistAuthState();
    },

    /**
     * Cierra la sesión del usuario
     */
    async logout(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await signOut(auth);
        this.user = null;
        this.clearAuthState();
        console.log("Sesión cerrada exitosamente");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        this.error = "Error al cerrar sesión";
        throw new RepositoryError(
          'Error al cerrar sesión',
          'logout',
          error as Error
        );
      } finally {
        this.loading = false;
      }
    },

    /**
     * Persiste el estado de autenticación (Deprecado: Firebase maneja esto)
     */
    persistAuthState(): void {
      // Firebase maneja la persistencia automáticamente
    },

    /**
     * Limpia el estado de autenticación
     */
    clearAuthState(): void {
      this.user = null;
      this.error = null;
      // DEBUG: Limpiar token manual
      localStorage.removeItem('debug_auth_token');
    },

    /**
     * Limpia el error actual
     */
    clearError(): void {
      this.error = null;
    },
  },

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    isAdmin: (state): boolean => state.user?.role === 'admin',
    isSuperAdmin: (state): boolean => state.user?.role === 'superadmin',
    isWaiter: (state): boolean => state.user?.role === 'waiter',
    isCustomer: (state): boolean => state.user?.role === 'customer',
    userRole: (state): string | null => state.user?.role || null,
    userName: (state): string | null => state.user?.name || null,
    userEmail: (state): string | null => state.user?.email || null,
  }
});
