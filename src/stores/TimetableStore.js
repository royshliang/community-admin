import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useTimetableStore = defineStore('TimetableStore', {
    state: () => ({
        timetable: [],
        colorCodes: ['#46d896','#9946d8','#46a5d8','#d8a846','#46d85c','#d86546','#d846bf']
    }),
    getters: {
        getTimetableEvents: (state) => {
            let eventArray = [];
            state.timetable.forEach(x => {
                let event = {
                    id: x.id,
                    start: "2023-08-01T" + x.classStart,
                    end: "2023-08-01T" + x.classEnd,
                    resource: String(x.classDay),
                    text: x.subjectName,
                    barColor: state.colorCodes[Math.floor(Math.random() * 7)]
                }
                eventArray.push(event)
            })

            return eventArray;
        }
    },
    actions: {
        async retrieveTimetableByCourse(courseId) {
            await axios.get(`${API_URL}/timetable/course/${courseId}`)
                .then(res => {
                    this.timetable = res.data
                })
                .catch(err => {
                    throw err
                })
        },
        async insert(model) {
            await axios.post(`${API_URL}/timetable`, model)
                .then(res => {
                    return res.affectedRows
                })
                .catch(err => {
                    throw err
                })
        },
        async update(model) {
            await axios.put(`${API_URL}/timetable`, model)
                .then(res => {
                    return res.changedRows
                })
                .catch(err => {
                    throw err
                })
        },
        async delete(resource) {
            await axios.delete(`${API_URL}/timetable`)
                .then(res => {
                    return res.affectedRows
                })
                .catch(err => {
                    throw err
                })
        }
    }
});
