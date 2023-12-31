<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <subject-dialog v-if="isModalVisible" :model="subject" :courses="courses" @dialog-closed="closeDialog"></subject-dialog>
    </transition>

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Subjects</a>
                <div class="d-flex">
                    <select class="form-select" id="courseid" v-model="selectedCourse">
                        <option value="-1" selected disabled>Please select a course</option>
                        <option v-for="course in courses" :value="course.id">
                            {{ course.courseName }}
                        </option>
                    </select>
                    <button type="button" class="btn btn-primary" @click="addSubject">ADD</button>
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
                            Code
                        </th>
                        <th scope="col">
                            Subject
                        </th>
                        <th scope="col" class="d-none d-md-table-cell">
                            Course
                        </th>
                        <th scope="col">
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(sub, index) in subjects" :key="subject.id">
                    <tr>
                        <td scope="col">
                            {{ index + 1 }}
                        </td>
                        <td scope="col" class="text-primary fw-bold">
                            {{ sub.subjectCode }}
                        </td>
                        <td scope="col">
                            {{ sub.subjectName }}
                        </td>
                        <td scope="col" class="d-none d-md-table-cell">
                            {{ sub.courseName }}
                        </td>
                        <td>
                            <div class="form-check form-switch">
                                <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markSubject(sub)" v-model="sub.status" v-bind:true-value="1" v-bind:false-value="0" >
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-sm btn-secondary" @click="editSubject(sub)">edit</button>
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

    import SubjectDialog from '@/components/SubjectDialog.vue'

    const selectedCourse = ref(-1)

    const subject = ref({})
    const subjects = ref([])
    const courses = ref([])
    const isModalVisible = ref(false)
    const isLoading = ref(false)

    const toast = useToast()
    const courseStore = useCourseStore()
    const subjectStore = useSubjectStore()


    function addSubject() {
        subject.value = { courseId: -1 }
        isModalVisible.value = true
    }
    function editSubject(model) {
        subject.value = model
        isModalVisible.value = true
    }
    async function markSubject(model) {
        try {
            isLoading.value = true
            await subjectStore.mark(model)
            toast.success("Data update successfuly")
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
            loadSujects(selectedCourse.value)
        }
    }


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
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }

    function closeDialog() {
        isModalVisible.value = false
        loadSujects(selectedCourse.value)
    }

    watch(selectedCourse, async (n, o) => {
        await loadSujects(n)
    })

    onMounted(async() => {
        await loadCourses()
    })
</script>

<style scoped>
</style>