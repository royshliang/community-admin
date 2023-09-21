<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <timetable-dialog v-if="isDialogVisible" :model="timetable" :subject-list="subjects" :location-list="locations" @dialog-closed="dialogClosed"></timetable-dialog>
    </transition>

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
            <DayPilotCalendar id="dp" :config="calendarConfig" ref="calendar" />
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue'

    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'

    import TimetableDialog from '@/components/TimetableDialog.vue'

    import { useTimetableStore } from '@/stores/TimetableStore'
    import { useSubjectStore }   from '@/stores/SubjectStore'
    import { useLocationStore }  from '@/stores/LocationStore'
    import { useCourseStore }    from '@/stores/CourseStore'

    const timetableStore = useTimetableStore()
    const locationStore = useLocationStore()
    const courseStore = useCourseStore()
    const subjectStore = useSubjectStore()

    const selectedCourse = ref(-1)
    const isDialogVisible = ref(false)
    const isLoading = ref(false)

    const calendar = ref(null)
    const timetable = ref({})
    const courses = ref([])
    const subjects = ref([])
    const locations = ref([])


    // ---
    const calendarConfig = ref({
        // ----- 1. calendar configurations
        viewType: "Resources",
        startDate: "2023-08-01",    //** dummmy date *//

        businessBeginsHour: 0,
        businessEndsHour: 19,
        heightSpec: "BusinessHoursNoScroll",

        cellHeight: 21,
        eventResizeHandling         : "Disabled",
        eventDeleteHandling         : "Enabled",
        timeRangeSelectedHandling   : "Enabled",
        eventMoveHandling           : false,
        eventResizeHandling         : false,
        eventRightClickHandling     : false,

        // ----- 1. calendar columns
        columns: [
            { name: "Monday",    id: "1" },
            { name: "Tuesday",   id: "2" },
            { name: "Wednesday", id: "3" },
            { name: "Thursday",  id: "4" },
            { name: "Friday",    id: "5" },
        ],

        // ----- 2. calendar events
        onTimeRangeSelected: async (args) => {
            timetable.value = { 
                id          : -1, 
                subjectId   : -1,
                locationId  : -1,
                classDay    : args.resource, 
                startTime   : args.start.toLocaleString(), 
                endTime     : args.end.toLocaleString() 
            }
            isDialogVisible.value = true;
        },
        onEventMoved: async (args) => {
            debugger;
            await postUpdateEvent(args.newStart, args.newEnd, args.newResource, args.e.data)
        },
        onEventDeleted: async (args) => {
            debugger;
            await postDeleteEvent(args.e.data)
        },

        onBeforeEventRender: args => {
            args.data.areas = []
            args.data.areas.push({ 
                html: `<span class='text-primary fw-bold'>${args.data.locationCode}</span>`,
                right: 2,
                bottom: 2
            })

            if(args.data.status == 0) {
                args.data.backColor = "#ffc0c0";
                args.data.areas.push({ html: '<h6 class="text-danger">** Cancelled **</h6>', left: 1, bottom: 1})
            }
        },

        // // ------ 3. calendar context menu
        contextMenu: new DayPilot.Menu({
            items: [
                {
                    text: "Edit", 
                    onClick: e => {
                        timetable.value = {
                            id          : e.data.id, 
                            subjectId   : e.data.subjectId,
                            locationId  : e.data.locationId,
                            status      : e.status,
                            classDay    : e.data.resource, 
                            startTime   : e.data.start.toLocaleString(), 
                            endTime     : e.data.end.toLocaleString() 
                        }
                        isDialogVisible.value = true
                    }
                },
                {
                    text: "Cancel", 
                    onClick: e => postMarkEvent(e.source) 
                }
            ],
            onShow: args => {
                const e = args.source;
                args.menu.items[1].text = e.data.status == 0 ? "Reset" : "Cancel"
            }
        })
    })



    async function postMarkEvent(timetable) {
        try {
            isLoading.value = true
            await timetableStore.mark(timetable)

            loadEvents(selectedCourse.value)
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }
    async function postCreateEvent(timetable) {
        debugger;

        try {
            isLoading.value = true
            await timetableStore.insert(timetable)

            loadEvents(selectedCourse.value)
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }
    async function postUpdateEvent(newStart, newEnd, newResource, evt) {
        debugger;

        try {
            isLoading.value = true

            timetable.value = {
                id         : evt.id,
                startTime  : newStart.value,
                endTime    : newEnd.value,
                classDay   : newResource
            }
            await timetableStore.update(timetable.value)

            loadEvents(selectedCourse.value)
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }
    async function postDeleteEvent(evt) {
        debugger;

        try {
            isLoading.value = true

            timetable.value = {
                id: evt.id
            }
            await timetableStore.delete(timetable.value)

            loadEvents(selectedCourse.value)
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }


    // ---
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
    async function loadLocations() {
        try {
            isLoading.value = true
            await locationStore.retrieveAll()
            locations.value = locationStore.getActiveLocations
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
    async function loadSubjects(courseId) {
        try {
            isLoading.value = true
            await subjectStore.retrieveByCourse(courseId)
            subjects.value = subjectStore.getActiveSubjects
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }


    // ---
    async function dialogClosed(model) {
        isDialogVisible.value = false;

        if(model) {
            await postCreateEvent(model)
        }

        calendar.value.control.clearSelection()
    }

    watch(selectedCourse, async (n, o) => {
        await loadEvents(n)
        await loadSubjects(n)
    })

    // ---- component events
    onMounted(async() => {
        await loadCourses()
        await loadLocations()
    })
</script>

<style scoped>
    .event-locked {
        background-color: red;
    }
    .event-cancelled {
        background-color: red;
    }
</style>