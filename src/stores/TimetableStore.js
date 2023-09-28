import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useTimetableStore = defineStore('TimetableStore', {
    state: () => ({
        timetable: []
    }),
    getters: {
        getTimetableEvents: (state) => {
            let eventArray = [];
            state.timetable.forEach(x => {
                let event = {
                    // standard daypilot data for event
                    id          : x.id,
                    text        : x.subjectName,
                    start       : "2023-08-01T" + x.startTime,
                    end         : "2023-08-01T" + x.endTime,
                    resource    : String(x.classDay),
                    barColor    : x.color,
                    fontColor   : x.color,
                    // --- custom data for event
                    status      : x.status,
                    subjectId   : x.subjectId,
                    locationId  : x.locationId,
                    locationCode: x.locationCode,
                }
                eventArray.push(event)
            })
            // state.timetable.map(x => {
            //     eventArray.push({
            //         // standard daypilot data for event
            //         id          : x.id,
            //         text        : x.subjectName,
            //         start       : "2023-08-01T" + x.startTime,
            //         end         : "2023-08-01T" + x.endTime,
            //         resource    : String(x.classDay),
            //         barColor    : x.color,
            //         fontColor   : x.color,
            //         // --- custom data for event
            //         status      : x.status,
            //         subjectId   : x.subjectId,
            //         locationId  : x.locationId,
            //         locationCode: x.locationCode,                    
            //     })
            // })

            return eventArray;
        }
    },
    actions: {
        async retrieveByCourse(courseId) {
            await axios.get(`${API_URL}/timetable/course/${courseId}`)
                .then(res => {
                    this.timetable = res.data
                })
                .catch(err => {
                    throw err
                })
        },
        
        async insert(vm) {
            await axios.post(`${API_URL}/timetable`, vm)
                .then(res => {
                    return res.affectedRows
                })
                .catch(err => {
                    throw err
                })
        },
        async update(vm) {
            await axios.put(`${API_URL}/timetable`, vm)
                .then(res => {
                    return res.changedRows
                })
                .catch(err => {
                    throw err
                })
        },
        async mark(vm) {
            await axios.put(`${API_URL}/timetable`, vm)
                .then(res => {
                    return res.changedRows
                })
                .catch(err => {
                    throw err
                })
        },
        async delete(vm) {
            await axios.delete(`${API_URL}/timetable`, { data: vm })
                .then(res => {
                    debugger;
                    return res.affectedRows
                })
                .catch(err => {
                    throw err
                })
        }
    }
});
