<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page="false" />

            <h5 v-if="subject.id == null">Add</h5>
            <h5 v-else>Edit</h5>

            <div class="container-fluid p-3">
                <!-- Code & Type -->
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="code" class="form-label">Subject Code:</label>
                        <input type="text" id="code" class="form-control" v-model="subject.subjectCode" :disabled="subject.subjectId > 0" :class="{ 'border-danger': $v.subjectCode.$dirty && $v.subjectCode.$invalid }">
                        <div v-if="$v.subjectCode.$dirty && $v.subjectCode.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.subjectCode.$dirty && $v.subjectCode.minLength.$invalid" style="color: red">Minimum length is 4</div>
                        <div v-if="$v.subjectCode.$dirty && $v.subjectCode.maxLength.$invalid" style="color: red">Maximum length is 6</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" id="name" class="form-control" v-model="subject.subjectName" :class="{ 'border-danger': $v.subjectName.$dirty && $v.subjectName.$invalid }">
                        <div v-if="$v.subjectName.$dirty && $v.subjectName.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.subjectName.$dirty && $v.subjectName.minLength.$invalid" style="color: red">Minimum length is 10</div>
                        <div v-if="$v.subjectName.$dirty && $v.subjectName.maxLength.$invalid" style="color: red">Maximum length is 40</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label class="form-label" for="courseid">Course</label>
                        <select class="form-select" id="courseid" v-model="subject.courseId" :class="{ 'border-danger': $v.courseId.$dirty && $v.courseId.$invalid }">
                            <option v-if="subject.courseId <= 0" value="-1" selected>Please select a course</option>
                            <option v-for="course in courses" :value="course.id">
                                {{ course.courseName }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary" @click="closeModal()">Close</button>
                    &nbsp;&nbsp;
                    <button type="button" class="btn btn-primary" @click="saveModal()">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import { useToast, POSITION } from 'vue-toastification'

    import { onMounted, ref, toRef } from 'vue'
    import { useCourseStore } from '@/stores/CourseStore'
    import { useSubjectStore } from '@/stores/SubjectStore'

    import { useVuelidate } from '@vuelidate/core'
    import { required, maxLength, minLength, minValue } from '@vuelidate/validators'

    const props = defineProps(['model', 'courses'])
    const emit = defineEmits(['closeModal'])

    const toast = useToast()
    const subject = toRef(props.model)
    const isLoading = ref(false)

    const subjectStore = useSubjectStore()
 
    const rules = {
        subjectCode : { required, minLength: minLength(3),  maxLength: maxLength(6), $autoDirty: true },
        subjectName : { required, minLength: minLength(10), maxLength:maxLength(40), $autoDirty: true },
        courseId    : { required, minValue: minValue(1), $autoDirty: true }
    }
    const $v = useVuelidate(rules, subject)


    function closeModal() {
        emit('closeModal', 0)
    }
    async function saveModal() {
        const isFormCorrect = await $v.value.$validate()
        if (!isFormCorrect) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form!',
                text: 'Please check all input fields',
            })
            return
        }

        debugger;
            
        try {
            isLoading.value = true

            if(subject.value.subjectId) {
                await subjectStore.update(subject.value)
            }
            else await subjectStore.insert(subject.value)

            toast.success("Data update successfuly", { position: POSITION.TOP_CENTER, timeout: 2500})
            emit('closeModal', 1)
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