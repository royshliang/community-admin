<template>
    <h4>Timetable</h4>
    <div>
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
            <div class="container-fluid">
                <div id="navbarCollapse" class="collapse navbar-collapse">
                    <ul class="nav navbar-nav w-50">
                        <a href="#" class="navbar-brand">Course</a>
                        <li class="nav-item w-50">
                            <select v-model="selectedCourse" class="form-select">
                                <option disabled value="0">Please Select</option>
                                <option v-for="course in courses" :value="course.id">{{course.name}}</option>
                            </select>
                        </li>
                   </ul>
                    <ul class="nav navbar-nav ms-auto">
                        <li class="nav-item dropdown">
                            <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Reports</a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a href="#" class="dropdown-item">Logs</a>
                                <a href="#" class="dropdown-item">Settings</a>
                                <!-- <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item">Logout</a> -->
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        
        <div class="content">
            <DayPilotCalendar id="dp" :config="calendarConfig" ref="calendar" />
        </div>

        <loading :active='isLoading' :is-full-page="true" />
        <timetable-dialog v-if="showDialog" :model="timetable" :subjects="subjects" @close="toggleDialog"></timetable-dialog>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue'
    import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'

    import Loading from 'vue-loading-overlay'
    import TimetableDialog from '@/components/TimetableDialog.vue'

    import { useTimetableStore } from '@/stores/TimetableStore'
    import { useCourseStore } from '@/stores/CourseStore'
    import { useSubjectStore } from '@/stores/SubjectStore'

    const timetableStore = useTimetableStore()
    const courseStore = useCourseStore()
    const subjectStore = useSubjectStore()

    const selectedCourse = ref(0)
    const showDialog = ref(false)
    const isLoading = ref(false)
    const calendar = ref(null)

    const courses = ref([])
    const subjects = ref([])
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
                subjectId: -1, 
                classDay: args.resource, 
                classStart: args.start.toLocaleString(), 
                classEnd: args.end.toLocaleString() 
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
        debugger;

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
        isLoading.value = true
        await timetableStore.retrieveTimetableByCourse(courseId)
        isLoading.value = false
        
        let events = timetableStore.getTimetableEvents;
        calendar.value.control.update({events})
    }
    async function loadCourses() {
        isLoading.value = true
        await courseStore.retrieveCourses()
        isLoading.value = false

        courses.value = courseStore.getCourses
    }
    async function loadSubjects(courseId) {
        isLoading.value = true
        await subjectStore.retrieveByCourse(courseId)
        isLoading.value = false

        subjects.value = subjectStore.getSubjects
    }

    async function toggleDialog(model) {
        showDialog.value = !showDialog.value
        if(model) {
            await createEvent(model)
        }

        calendar.value.control.clearSelection()
    }

    watch(selectedCourse, async (n, o) => {
        await loadEvents(n)
        await loadSubjects(n)
    })


    // ---- component events
    onMounted(async() => {
        try
        {
            await loadCourses()
            await loadEvents(selectedCourse.value)
        }
        catch(err) {
        }
        finally {
            isLoading.value = false
        }
    })
</script>

<style scoped>
    a.router-link-active.router-link-exact-active {
        color: white;
    }
</style>