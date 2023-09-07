import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useSubjectStore = defineStore('SubjectStore', {
    state: () => ({
        subject: {},
        subjects: []
    }),
    getters: {
        getSubjects: (state) => {
            return state.subjects
        }
    },
    actions: {
        retrieveSubjects: async function() {
            await axios.get(`${API_URL}/subjects`)
                .then(res => {
                    this.subjects = res.data
                })
                .catch(err => {
                    throw err.message;
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/subject/id/${id}`)
                .then(res => {
                    this.subject = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveByCourse: async function(id) {
            await axios.get(`${API_URL}/subject/course/id/${id}`)
                .then(res => {
                    this.subjects = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        update: async function(vm) {
            await axios.put(`${API_URL}/subject`)
                .then()
                .catch(err => {
                    throw err.message
                })
        },
        insert: async function(vm) {
            await axios.post(`${API_URL}/subject`)
                .then()
                .catch(err => {
                    throw err.message
                })
        }
    }
})
