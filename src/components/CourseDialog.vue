<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page='false' />

            <div class="text-center">
                <h5 v-if="course.id == null">Add Course</h5>
                <h5 v-else>Edit Course</h5>
            </div>

            <div class="container-fluid p-3">
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="code" class="form-label">Course Code:</label>
                        <input type="text" id="code" class="form-control" v-model="course.code" :disabled="course.id > 0" :class="{ 'border-danger': $v.code.$dirty && $v.code.$invalid }">
                        <div v-if="$v.code.$dirty && $v.code.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.code.$dirty && $v.code.minLength.$invalid" style="color: red">Minimum length is 4</div>
                        <div v-if="$v.code.$dirty && $v.code.maxLength.$invalid" style="color: red">Maximum length is 6</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" id="name" class="form-control" v-model="course.courseName" :class="{ 'border-danger': $v.courseName.$dirty && $v.courseName.$invalid }">
                        <div v-if="$v.courseName.$dirty && $v.courseName.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.courseName.$dirty && $v.courseName.minLength.$invalid" style="color: red">Minimum length is 10</div>
                        <div v-if="$v.courseName.$dirty && $v.courseName.maxLength.$invalid" style="color: red">Maximum length is 40</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary" @click="closeDialog">Close</button>
                    &nbsp;&nbsp;
                    <button type="button" class="btn btn-primary" @click="saveDialog">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import { useToast } from 'vue-toastification'

    import { onMounted, ref, toRef } from 'vue'
    import { useCourseStore } from '@/stores/CourseStore';

    // For Validation
    import { useVuelidate } from '@vuelidate/core'
    import { required, maxLength, minLength } from '@vuelidate/validators'

    const props = defineProps(['model'])
    const emit = defineEmits(['dialogClosed'])

    const course = toRef(props.model)
    const isLoading = ref(false)
    const toast = useToast()
    const courseStore = useCourseStore()
 
    const rules = {
        code        : { required, minLength: minLength(3),  maxLength: maxLength(6), $autoDirty: true },
        courseName  : { required, minLength: minLength(10), maxLength:maxLength(40), $autoDirty: true }
    }
    const $v = useVuelidate(rules, course)


    function closeDialog() {
        emit('dialogClosed')
    }
    async function saveDialog() {
        const isFormCorrect = await $v.value.$validate()
        if (!isFormCorrect) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form!',
                text: 'Please check all input fields',
            })
            return
        }
            
        try {
            isLoading.value = true

            if(course.value.id) {
                await courseStore.update(course.value)
            }
            else await courseStore.insert(course.value)

            toast.success("Data update successfuly")
            emit('dialogClosed', 1)
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message  })
        }
        finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
    });
</script>

<style scoped></style>