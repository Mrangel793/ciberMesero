// src/stores/auth.ts (TU CÓDIGO CON LOGS)
import { defineStore } from 'pinia';
import type { AuthenticatedUser } from '@/core/entities/AuthenticatedUser';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'; // Importa el tipo User
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/data/firebase/firebaseConfig';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthenticatedUser | null,
    authReady: false,
  }),
  actions: {
    async fetchUser(firebaseUser: User) { // Usamos el tipo User para seguridad
      console.log("3. DENTRO de fetchUser, buscando datos para UID:", firebaseUser.uid);
      const docRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(docRef);

      if (userSnap.exists()) {
        this.user = userSnap.data() as AuthenticatedUser;
        this.user.uid = firebaseUser.uid;
        console.log("3-1. Usuario encontrado en Firestore y asignado al store.");
      } else {
        console.warn(`No se encontró un documento de usuario en Firestore para el UID: ${firebaseUser.uid}`);
        this.user = null;
      }
    },

    initAuthListener() {
      return new Promise<void>((resolve) => {
        console.log("1. initAuthListener INICIADO"); // LOG 1
        onAuthStateChanged(auth, async (user) => {
          console.log("2. onAuthStateChanged se disparó. Usuario de Firebase:", user ? user.uid : 'null'); // LOG 2

          if (user) {
            await this.fetchUser(user);
          } else {
            this.user = null;
          }

          if (!this.authReady) {
            this.authReady = true;
            console.log("4. Auth está LISTA. Resolviendo la promesa."); // LOG 4
            resolve();
          }
        });
      });
    },

    login(user: AuthenticatedUser) {
      this.user = user;
    },


    async logout() {
      await signOut(auth);
      this.user = null;
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  }
});
