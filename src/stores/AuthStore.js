import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const AUTH_KEY = import.meta.env.VITE_AUTH_KEY

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        user: null
    }),
    getters: {
        getUser: (state) => {
            return state.user 
        },
    },
    actions: {
        logout: function() {
            this.user = null
        }
    }
})