import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useCourseStore = defineStore('CourseStore', {
    state: () => ({
        course: {},
        courses: []
    }),
    getters: {
        getCourses: (state) => {
            return state.courses
        }
    },
    actions: {
        retrieveCourses: async function() {
            await axios.get(`${API_URL}/courses`)
                .then(res => {
                    this.courses = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/course/id/${id}`)
                .then(res => {

                })
                .catch(err => {
                    throw err.message
                })
        },
        update: async function(vm) {
            await axios.put(`${API_URL}/course`)
                .then()
                .catch(err => {
                    throw err.message
                })
        },
        mark: async function(vm) {
            await axios.put(`${API_URL}/course/mark`)
                .then(res => {

                })
                .catch(err => {

                })
        },
        insert: async function(vm) {
            await axios.post(`${API_URL}/course}`)
                .then()
                .catch(err => {
                    throw err.message
                })
        }
    }
})
