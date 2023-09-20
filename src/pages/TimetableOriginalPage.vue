<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <timetable-dialog v-if="showDialog" :model="timetable" :subject-list="subjects" :location-list="locations" @dialog-closed="toggleDialog"></timetable-dialog>
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
    const showDialog = ref(false)
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

        cellHeight: 20,
        // cellDuration: 60,
        // timeHeaderCellDuration: 60,
        // dayBeginsHour: 0,
        // dayEndsHour: 24,

        //eventMovingSkipNonBusiness: true,
        // showNonBusiness: true,
        //allowEventOverlap         : "false",
        eventDeleteHandling       : "Update",
        eventResizeHandling       : "Disabled",
        timeRangeSelectedHandling : "Enabled",


        // ----- calendar columns
        columns: [
            { name: "Monday",    id: "1" },
            { name: "Tuesday",   id: "2" },
            { name: "Wednesday", id: "3" },
            { name: "Thursday",  id: "4" },
            { name: "Friday",    id: "5" },
            // { name: "Saturday",  id: "6" },
        ],


        // --- 2. calendar events
        onTimeRangeSelected: async (args) => {
            timetable.value = { 
                id          : -1, 
                subjectId   : -1,
                locationId  : -1,
                classDay    : args.resource, 
                startTime   : args.start.toLocaleString(), 
                endTime     : args.end.toLocaleString() 
            }

            showDialog.value = true;
            //await addEvent(args.start, args.end, args.resource)
        },
        onEventMoved: async (args) => {
            debugger;
            console.log("Event resized", args.e);

            await updateEvent(args.start, args.end, args.resoure)
        },
        // onEventResized: async (args) => {
        //     debugger
        //     console.log("Event resized", args.e);

        //     await updateEvent(args.start, args.end, args.resoure)
        // },
        onEventDeleted: async (args) => {
            console.log("Event deleted", args.e)

            await deleteEvent(args.resource)
        },
        onBeforeEventRender: args => {
            // if (args.data.locked) {
            //     args.data.cssClass = "event-locked";
            //     args.data.text += " (locked)";
            // }

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


        // ------ 3. calendar context menu
        contextMenu: new DayPilot.Menu({
            items: [
                {
                    text: "Edit", 
                    symbol: "daypilot.svg#padlock", 
                    onClick: args => editEvent(args.source) 
                },
                {
                    text: "Cancel", 
                    symbol: "daypilot.svg#padlock",
                    onClick: args => markEvent(args.source) 
                }
            ],
            onShow: args => {
                const e = args.source;
                //const locked = e.data.locked;

                args.menu.items[1].text = e.data.status == 0 ? "Reset" : "Cancel"
            }
        })
    })


    // ---
    function editEvent(e) {
        debugger;
        timetable.value = { 
            id          : e.data.id, 
            subjectId   : e.data.subjectId,
            locationId  : e.data.locationId,
            status      : e.status,
            classDay    : e.data.resource, 
            startTime   : e.data.start.toLocaleString(), 
            endTime     : e.data.end.toLocaleString() 
        }

        showDialog.value = true
    }
    function markEvent(e) {
        debugger;
        
        try {
            isLoading.value = true

        }
        catch(err) {

        }
        finally {
            isLoading.value = false
        }

        // e.data.locked = !e.data.locked;
        // calendar.value.control.events.update(e);
    }
    // async function addEvent(start, end, resource) {
    //     const form = [
    //         {name: "Text", id: "text"},
    //         {name: "Start", id: "start", type: "datetime", disabled: true},
    //         {name: "End", id: "end", type: "datetime", disabled: true},
    //         {name: "Resource", id: "resource", type: "select", options: calendar.value.control.columns.list}
    //     ];
    //     const data = {
    //         start,
    //         end,
    //         resource,
    //         id: DayPilot.guid()
    //     };
    //     const modal = await DayPilot.Modal.form(form, data);
    //     if (modal.canceled) {
    //         return;
    //     }

    //     debugger;

    //     const e = modal.result;
    //     calendar.value.control.events.add(e);
    // }
    async function createEvent(timetable) {
        let dd = new DayPilot.Event({
            start: new DayPilot.Date(timetable.startTime),
            id: -1,
            end: new DayPilot.Date(timetable.endTime),
            text: timetable.text,
            resource: timetable.classDay
        })
        debugger;
        calendar.value.control.events.add(dd)
        return

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

            debugger;

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


    async function closeDialog() {
        
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