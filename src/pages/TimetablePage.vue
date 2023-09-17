<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <timetable-dialog v-if="showDialog" :model="timetable" :course="selectedCourse" @close-dialog="toggleDialog"></timetable-dialog>
    </transition>

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Timetable</a>
                <div class="d-flex">
                    <select v-model="selectedCourse" class="form-select">
                        <option disabled value="-1">Please Select a course</option>
                        <option v-for="course in courses" :value="course.id">{{course.courseName}}</option>
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
    import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'

    import Loading from 'vue-loading-overlay'
    import TimetableDialog from '@/components/TimetableDialog.vue'

    import { useTimetableStore } from '@/stores/TimetableStore'
    import { useCourseStore } from '@/stores/CourseStore'

    const timetableStore = useTimetableStore()
    const courseStore = useCourseStore()

    const selectedCourse = ref(-1)
    const showDialog = ref(false)
    const isLoading = ref(false)
    const calendar = ref(null)

    const courses = ref([])
    const timetable = ref({})

    const calendarConfig = ref({

        // ----- 1. calendar configurations
        viewType: "Resources",

        startDate: "2023-08-01",    //** dummmy date *//

        businessBeginsHour: 0,
        businessEndsHour: 19,
        heightSpec: "BusinessHoursNoScroll",

        cellDuration: 60,
        cellHeight: 23,

        // dayBeginsHour: 8,
        // dayEndsHour: 22,

        //eventMovingSkipNonBusiness: true,
        // showNonBusiness: true,
        
        eventDeleteHandling: "Update",
        timeRangeSelectedHandling: "Enabled",

        // ----- calendar columns
        columns: [
            { name: "Monday",    id: "1" },
            { name: "Tuesday",   id: "2" },
            { name: "Wednesday", id: "3" },
            { name: "Thursday",  id: "4" },
            { name: "Friday",    id: "5" },
            { name: "Saturday",  id: "6" },
        ],


        // --- 2. calendar events
        onTimeRangeSelected: async (args) => {
            timetable.value = { 
                id: -1, 
                subjectId: 0,
                classDay: args.resource, 
                startTime: args.start.toLocaleString(), 
                endTime: args.end.toLocaleString() 
            }
            showDialog.value = true;
        },
        onEventMoved: async (args) => {
            debugger;
            console.log("Event resized", args.e);

            await updateEvent(args.start, args.end, args.resoure)
        },
        onEventResized: async (args) => {
            debugger
            console.log("Event resized", args.e);

            await updateEvent(args.start, args.end, args.resoure)
        },
        onEventDeleted: async (args) => {
            console.log("Event deleted", args.e)

            await deleteEvent(args.resource)
        },
        onBeforeEventRender: args => {
            if (args.data.locked) {
                args.data.cssClass = "event-locked";
                args.data.text += " (locked)";
            }
        },


        // ------ 3. calendar context menu
        contextMenu: new DayPilot.Menu({
            items: [{
                    text: "Cancel", 
                    symbol: "daypilot.svg#padlock", 
                    onClick: args => lockEvent(args.source) 
                },
            ],
            onShow: args => {
                const e = args.source;
                const locked = e.data.locked;

                args.menu.items[2].text = locked ? "Unlock" : "Lock"
            }
        })
    })


    // --- component methods
    function lockEvent(e) {
        debugger;
        e.data.locked = !e.data.locked;
        calendar.value.control.events.update(e);
    }
    async function createEvent(timetable) {
        try {
            isLoading.value = true
            await timetableStore.insert(timetable)
            loadEvents(selectedCourse.value)
            //calendar.value.control.events.add(e)
        }
        catch(err) {
            alert(err.message)
        }
        finally {
            isLoading.value = false
        }

        // const e = modal.result;
        // calendar.value.control.events.add(e);
    }
    async function updateEvent(start, end, resorce) {
        debugger
    }
    async function deleteEvent(resource) {
        debugger
    }

    async function loadEvents(courseId) {
        try {
            isLoading.value = true
            await timetableStore.retrieveByCourse(courseId)
            let events = timetableStore.getTimetableEvents;

            calendar.value.control.update({events})
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })            
        }
        finally {
            isLoading.value = false
        }        
    }
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


    async function toggleDialog(model) {
        await loadSubjects(n)

        showDialog.value = !showDialog.value
        if(model) {
            await createEvent(model)
        }

        calendar.value.control.clearSelection()
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