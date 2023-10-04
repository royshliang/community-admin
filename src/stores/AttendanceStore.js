import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useAttendanceStore = defineStore('AttendanceStore', {
    state: () => ({
        attendance: {},
        attendances: []
    }),
    getters: {
        getAttendance: (state) => {
            return state.attendance
        },
        getAttendances: (state) => {
            return state.attendances
        },
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/attendances`)
                .then(res => {
                    this.courses = res.data
                })
                .catch(err => {
                    throw err
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/attendance/id/${id}`)
                .then(res => {
                    this.attendances = res.data
                })
                .catch(err => {
                    throw err
                })
        },
        retrieveBySubject: async function(id) {
            await axios.get(`${API_URL}/attendances/subject/${id}`)
                .then(res => {
                    this.attendances = res.data
                })
                .catch(err => {
                    throw err
                })
        },
        insert: async function(vm) {
            await axios.post(`${API_URL}/attendance`, vm)
                .then(res => {
                    return res.data
                })
                .catch(err => {
                    throw err
                })
        }
    }
})
