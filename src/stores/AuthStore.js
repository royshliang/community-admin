import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_KEY = 'community-auth-key'

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        user: null
    }),
    getters: {
        getUser: (state) => {
            return state.user || JSON.parse(localStorage.getItem(AUTH_KEY))
        },
    },
    actions: {
        authenticate: async function(email, pwd) {
            this.user = null
            await axios.post(`${API_URL}/user/authenticate`, {email: email, password: pwd})
                .then(res => {
                    if(res.data) {
                        this.user = res.data
                        window.localStorage.setItem(AUTH_KEY, JSON.stringify(res.data)) // caching logic
                    }
                })
                .catch(err => {
                    throw err
                })
        },
        logout: function() {
            this.user = null
            window.localStorage.removeItem(AUTH_KEY)    // caching logic
        }
    }
})