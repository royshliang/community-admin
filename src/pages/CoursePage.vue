<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <course-dialog v-if="isModalVisible" :model="course" @close-modal="closeModal"></course-dialog>
    </transition>


    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Courses</a>
                <div class="d-flex">
                    <button type="button" class="btn btn-primary" @click="addCourse">ADD</button>
                </div>
            </div>
        </nav>

        <hr/>
        <div class="container justify-content-center">
            <div class="p-1">
                <div class="row">
                    <div class="col-12 col-md-4 col-lg-4" v-for="course in courses" :key="course.id">
                        <div class="card mb-2">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-primary fw-bold">{{ course.code }}</span>
                                </div>
                                <button type="button" class="btn btn-sm btn-secondary" @click="editCourse(course)">edit</button>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <p class="card-text">{{ course.courseName }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="d-flex justify-content-end pt-4">
                                        <div class="form-check form-switch">
                                            <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                            <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markCourse(course)" v-model="course.status" v-bind:true-value="1" v-bind:false-value="0" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useToast } from 'vue-toastification'
    import Loading from 'vue-loading-overlay'
    import Swal from 'sweetalert2'

    import { useCourseStore } from '@/stores/CourseStore'
    
    import CourseDialog from '@/components/CourseDialog.vue';


    const courses = ref([])
    const course = ref({})
    const isLoading = ref(false)
    const isModalVisible = ref(false)

    const toast = useToast()
    const courseStore = useCourseStore()
    

    function addCourse() {
        course.value = {}
        isModalVisible.value = true
    }
    function editCourse(model) {
        course.value = model
        isModalVisible.value = true
    }
    async function markCourse(model) {
        try {
            isLoading.value = true
            await courseStore.mark(model)
            toast.success("Data update successfuly")
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
            loadCourses()
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

    function closeModal(res) {
        isModalVisible.value = false
        loadCourses()
    }    
    
    onMounted(async() => {
        await loadCourses()
    })
</script>

<style scoped>
</style>