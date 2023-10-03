<template>
    <loading :active='isLoading' :is-full-page="true" />

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Timetable</a>
                <div class="d-flex">
                    <select v-model="selectedCourse" class="form-select">
                        <option disabled value="-1">Please Select a course</option>
                        <option v-for="course in courses" :value="course.id" :key="course.id">{{course.courseName}}</option>
                    </select>
                </div>
            </div>
        </nav>
        <hr/>
        <div class="container">
            <DayPilotCalendar :config="calendarConfig" ref="calendar" />
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue'

    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import { DayPilotCalendar } from '@daypilot/daypilot-lite-vue'

    import { useTimetableStore } from '@/stores/TimetableStore'
    import { useCourseStore }    from '@/stores/CourseStore'

    const courseStore = useCourseStore()
    const timetableStore = useTimetableStore()

    const selectedCourse = ref(-1)
    const isLoading = ref(false)
    const courses = ref([])
    const calendar = ref(null)

    // ---
    const calendarConfig = ref({
        // ----- 1. calendar configurations
        viewType: "Resources",
        startDate: "2023-08-01",    //** dummmy date *//

        businessBeginsHour: 7,
        businessEndsHour: 19,

        eventDeleteHandling         : "Disabled",
        eventResizeHandling         : "Disabled",
        eventClickHandling          : "Disabled",
        eventMoveHandling           : "Disabled",
        timeRangeSelectedHandling   : "Disabled",

        // ----- 1. calendar columns
        columns: [
            { name: "Monday",    id: "1" },
            { name: "Tuesday",   id: "2" },
            { name: "Wednesday", id: "3" },
            { name: "Thursday",  id: "4" },
            { name: "Friday",    id: "5" },
        ]
    })


    async function loadCourses() {
        try {
            isLoading.value = true
            await courseStore.retrieveAll()
            courses.value = courseStore.getCourses
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }
    async function loadEvents(courseId) {
        try {
            isLoading.value = true
            await timetableStore.retrieveByCourse(courseId)
            let events = timetableStore.getTimetableEvents

            calendar.value.control.update({events})
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }        
    }

    watch(selectedCourse, async (n, o) => {
        await loadEvents(n)
    })

    // ---- component events
    onMounted(async() => {
        await loadCourses()
    })
</script>

<style scoped>
</style>