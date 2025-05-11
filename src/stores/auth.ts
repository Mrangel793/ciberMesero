import { defineStore } from 'pinia';
import type { AuthenticatedUser } from '@/core/interfaces/AuthenticatedUser';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/data/firebase/firebaseConfig';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthenticatedUser | null,
    loading: true,
  }),

  actions: {
    // 👉 Cargar usuario desde Firestore
    async fetchUser(firebaseUser: any) {
      const docRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(docRef);

      if (userSnap.exists()) {
        this.user = userSnap.data() as AuthenticatedUser;
      } else {
        this.user = null;
      }
    },

    // 👉 Escucha el estado de autenticación de Firebase
    initAuthListener() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await this.fetchUser(user);
        } else {
          this.user = null;
        }
        this.loading = false;
      });
    },

    // ✅ Login (usualmente ya se hace en otro lado, pero puedes centralizar aquí)
    login(user: AuthenticatedUser) {
      this.user = user;
    },

    // ✅ Logout completo y redirección
    async logout() {
      await signOut(auth);
      this.user = null;
    }
  }
});
