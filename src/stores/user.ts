import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    notTokenApis: ['/login', '/register']
  }),
  actions: {
    logout() {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
  }
})

export default useUserStore
