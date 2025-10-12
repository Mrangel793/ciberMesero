import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { authService } from '@/modules/auth/services/authService';
import { auth } from '@/firebaseConfig';
import type { UserRole } from '@/shared/constants/roles';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<FirebaseUser | null>(null);
  const userRole = ref<UserRole | null>(null);
  const userName = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  // Getters
  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => userRole.value === 'admin');
  const isRestaurantOwner = computed(() => userRole.value === 'restaurant_owner');
  const isCustomer = computed(() => userRole.value === 'customer');
  const isWaiter = computed(() => userRole.value === 'waiter');

  // Actions
  async function login(email: string, password: string): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const { user: firebaseUser, role } = await authService.login(email, password);
      user.value = firebaseUser;
      userRole.value = role;

      // Obtener datos adicionales del usuario
      const userData = await authService.getUserData(firebaseUser.uid);
      userName.value = userData.name || null;

      // Persistir en localStorage
      persistAuthState();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string, name: string, role: UserRole = 'customer'): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const userCredential = await authService.register(email, password, name, role);
      user.value = userCredential.user;
      userRole.value = role;
      userName.value = name;

      // Persistir en localStorage
      persistAuthState();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      await authService.logout();
      clearAuthState();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser;

          try {
            // Obtener rol del usuario
            const role = await authService.getUserRole(firebaseUser.uid);
            userRole.value = role;

            // Obtener datos adicionales
            const userData = await authService.getUserData(firebaseUser.uid);
            userName.value = userData.name || null;

            persistAuthState();
          } catch (err) {
            console.error('Error al obtener datos del usuario:', err);
            clearAuthState();
          }
        } else {
          clearAuthState();
        }

        isInitialized.value = true;
        resolve();
      });
    });
  }

  function persistAuthState(): void {
    if (user.value && userRole.value) {
      localStorage.setItem('userRole', userRole.value);
      if (userName.value) {
        localStorage.setItem('userName', userName.value);
      }
    }
  }

  function clearAuthState(): void {
    user.value = null;
    userRole.value = null;
    userName.value = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }

  function clearError(): void {
    error.value = null;
  }

  return {
    // State
    user,
    userRole,
    userName,
    loading,
    error,
    isInitialized,
    // Getters
    isAuthenticated,
    isAdmin,
    isRestaurantOwner,
    isCustomer,
    isWaiter,
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    clearError
  };
});
