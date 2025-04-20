import { defineStore } from 'pinia'

export interface User {
  name: string
  role: 'superadmin' | 'admin' | 'cocina' | 'mesero' | 'cliente'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    login(payload: User) {
      this.user = payload
    },
    logout() {
      this.user = null
    }
  }
})
