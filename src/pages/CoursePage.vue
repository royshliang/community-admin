<template>
    <loading :active='isLoading' :is-full-page="true" />

    <div class="container-fluid">
        <div class="row">
            <div class="col-10">
                <h3>Courses</h3>
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-primary" click="addCourse()">ADD</button>
            </div>
        </div>
        <br/><hr/>
        <div class="container-fluid justify-content-center">
            <div class="container">
                <div class="row">
                    <div class="col-md-6" v-for="course in courses" :key="course.id">
                        <div class="card mb-2">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <h5 class="card-title text-primary">{{ course.code }}</h5>
                                        <p class="card-text">{{ course.name }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="d-flex justify-content-end">
                                        <div class="form-check form-switch col-3">
                                            <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markCourse(item)" v-model="course.status" v-bind:true-value="1" v-bind:false-value="0" >
                                            <label class="form-check-label" for="statusDelSwitch">Active ?</label>
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

    import Loading from 'vue-loading-overlay'
    import { useCourseStore } from '@/stores/CourseStore'

    const courses = ref([])
    const course = ref({})
    const isLoading = ref(false)

    const courseStore = useCourseStore()

    async function loadCourses() {
        try
        {
            debugger;
            isLoading.value = true
            await courseStore.retrieveCourses()
            courses.value = courseStore.getCourses
        }
        catch(err) {
            alert(err.message)
        }
        finally {
            isLoading.value = false
        }
    }
    async function markCourse() {
        try {
        }
        catch(err) {
        }
    }


    onMounted(async() => {
        await loadCourses()
    })
</script>

<style scoped>
</style>