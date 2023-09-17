<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page="false" />

            <h5 v-if="location.id == null">Add Location</h5>
            <h5 v-else>Edit Location</h5>

            <div class="container-fluid p-3">
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="code" class="form-label">Code:</label>
                        <input type="text" id="code" class="form-control" v-model="location.code" :disabled="location.id > 0" :class="{ 'border-danger': $v.code.$dirty && $v.code.$invalid }">
                        <div v-if="$v.code.$dirty && $v.code.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.code.$dirty && $v.code.minLength.$invalid" style="color: red">Minimum length is 4</div>
                        <div v-if="$v.code.$dirty && $v.code.maxLength.$invalid" style="color: red">Maximum length is 6</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="name" class="form-label">Description:</label>
                        <input type="text" id="name" class="form-control" v-model="location.description" :class="{ 'border-danger': $v.description.$dirty && $v.description.$invalid }">
                        <div v-if="$v.description.$dirty && $v.description.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.description.$dirty && $v.description.minLength.$invalid" style="color: red">Minimum length is 10</div>
                        <div v-if="$v.description.$dirty && $v.description.maxLength.$invalid" style="color: red">Maximum length is 40</div>
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
    import { useToast } from 'vue-toastification'

    import { onMounted, ref, toRef } from 'vue'
    import { useLocationStore } from '@/stores/LocationStore';

    // For Validation
    import { useVuelidate } from '@vuelidate/core'
    import { required, maxLength, minLength } from '@vuelidate/validators'

    const props = defineProps(['model'])
    const emit = defineEmits(['closeModal'])

    const toast = useToast()
    const location = toRef(props.model)
    const isLoading = ref(false)
    const locationStore = useLocationStore()
 
    const rules = {
        code        : { required, minLength: minLength(3),  maxLength: maxLength(12), $autoDirty: true },
        description : { required, minLength: minLength(6), maxLength:maxLength(40), $autoDirty: true }
    }
    const $v = useVuelidate(rules, location)


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
            
        try {
            isLoading.value = true

            if(location.value.id) {
                await locationStore.update(location.value)
            }
            else await locationStore.insert(location.value)

            toast.success("Data update successfuly")
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