<template>
    <loading :active='isLoading' :is-full-page="true" />

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Attendances</a>
                <div class="d-flex">
                    <select class="form-select" id="courseid" v-model="selectedCourse">
                        <option value="-1" selected disabled>Please select a course</option>
                        <option v-for="course in courses" :value="course.id" :key="course.id">
                            {{ course.courseName }}
                        </option>
                    </select>
                    <select class="form-select" id="courseid" v-model="selectedSubject">
                        <option value="-1" selected disabled>Please select a subject</option>
                        <option v-for="sub in subjects" :value="sub.subjectId" :key="sub.subjectId">
                            {{ sub.subjectName }}
                        </option>
                    </select>
                </div>
            </div>
        </nav>
        <hr/>
        <div class="container justify-content-center">
            <table class="table">
                <thead>
                    <tr> 
                        <th scope="col" class="text-center">
                        </th>
                        <th scope="col">
                            Course
                        </th>
                        <th scope="col">
                            Subject
                        </th>
                        <th scope="col" class="d-none d-md-table-cell">
                            ScanDate
                        </th>
                        <th scope="col">
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(attendance, index) in attendances" :key="attendance.id">
                    <tr>
                        <td scope="col">
                            {{ index + 1 }}
                        </td>
                        <td scope="col" class="text-primary fw-bold">
                            {{ attendance.studentEmail }}
                        </td>
                        <td scope="col">
                            {{ attendance.subjectName }}
                        </td>
                        <td scope="col" class="d-none d-md-table-cell">
                            {{ attendance.scanDate }}
                        </td>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'
    import Loading from 'vue-loading-overlay'
    import Swal from 'sweetalert2'

    import { useToast } from 'vue-toastification'
    import { useSubjectStore } from '@/stores/SubjectStore'
    import { useCourseStore } from '@/stores/CourseStore'
    import { useAttendanceStore } from '@/stores/AttendanceStore'

    const selectedCourse = ref(-1)
    const selectedSubject = ref(-1)

    const courses = ref([])
    const subjects = ref([])
    const attendances = ref([])

    const isLoading = ref(false)

    const courseStore = useCourseStore()
    const subjectStore = useSubjectStore()
    const attendanceStore = useAttendanceStore()

    async function loadCourses() {
        try
        {
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
    async function loadSujects(courseId) {
        try
        {
            isLoading.value = true
            await subjectStore.retrieveByCourse(courseId)
            subjects.value = subjectStore.getSubjects
            debugger;
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }
    async function loadAttendances(subjectId) {
        try
        {
            isLoading.value = true
            debugger;
            await attendanceStore.retrieveBySubject(subjectId)
            attendances.value = attendanceStore.getAttendances
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }


    watch(selectedCourse, async(n, o) => {
        await loadSujects(n)
    })
    watch(selectedSubject, async(n, o) => {
        debugger;
        await loadAttendances(n)
    })

    onMounted(async() => {
        await loadCourses()
    })
</script>