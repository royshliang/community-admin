import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useStudentStore = defineStore('StudentStore', {
    state: () => ({
        students: []
    }),
    getters: {
        getStudents: (state) => {
            return state.students
        },
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/students`)
                .then(res => {
                    this.students = res.data
                })
                .catch(err => {
                    throw err.message
                })
        }
    }
});
