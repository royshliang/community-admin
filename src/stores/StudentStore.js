import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useStudentStore = defineStore('StudentStore', {
    state: () => ({
        student: {},
        students: []
    }),
    getters: {
        getStudents: (state) => {
            return state.students
        },
        getStudent: (state) => {
            return state.student
        }
    },
    actions: {
        retrieveStudents: async function() {
            await axios.get(`${API_URL}/students`)
                .then(res => {
                    this.students = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/student/id/${id}`)
                .then(res => {
                    this.student = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        update: async function(vm) {
            await axios.put(`${API_URL}/student`)
                .then()
                .catch(err => {
                    throw err.message
                })
        },
        insert: async function(vm) {
            await axios.post(`${API_URL}/student}`)
                .then()
                .catch(err => {
                    throw err.message
                })
        }
    }
});
