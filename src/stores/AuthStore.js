import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({

    }),
    getters: {

    },
    actions: {
        validate: async function(email, pwd) {
            axios.get(`${API_URL}/user/validate`)
        }
    }
})