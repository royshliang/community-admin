<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page="false" />

            <div class="col-12 text-center bg-dark text-light">
                <h5 v-if="user.id == null">Add User</h5>
                <h5 v-else>Edit User</h5>
            </div>

            <div class="container-fluid p-3">
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" id="name" class="form-control" v-model="user.name" :disabled="user.id > 0" :class="{ 'border-danger': $v.name.$dirty && $v.name.$invalid }">
                        <div v-if="$v.name.$dirty && $v.name.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.name.$dirty && $v.name.minLength.$invalid" style="color: red">Minimum length is 4</div>
                        <div v-if="$v.name.$dirty && $v.name.maxLength.$invalid" style="color: red">Maximum length is 6</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="name" class="form-label">Email:</label>
                        <input type="text" id="name" class="form-control" v-model="user.email" :class="{ 'border-danger': $v.email.$dirty && $v.email.$invalid }">
                        <div v-if="$v.email.$dirty && $v.email.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.email.$dirty && $v.email.email.$invalid" style="color: red">Invalid email</div>
                        <div v-if="$v.email.$dirty && $v.email.minLength.$invalid" style="color: red">Minimum length is 10</div>
                        <div v-if="$v.email.$dirty && $v.email.maxLength.$invalid" style="color: red">Maximum length is 40</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="name" class="form-label">Password:</label>
                        <input type="text" id="name" class="form-control" v-model="user.password" :class="{ 'border-danger': $v.password.$dirty && $v.password.$invalid }">
                        <div v-if="$v.password.$dirty && $v.password.required.$invalid" style="color: red">This field is required</div>
                        <div v-if="$v.password.$dirty && $v.password.minLength.$invalid" style="color: red">Minimum length is 10</div>
                        <div v-if="$v.password.$dirty && $v.password.maxLength.$invalid" style="color: red">Maximum length is 40</div>
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
    import { useUserStore } from '@/stores/UserStore';

    // For Validation
    import { useVuelidate } from '@vuelidate/core'
    import { required, maxLength, minLength, email } from '@vuelidate/validators'

    const props = defineProps(['model'])
    const emit = defineEmits(['closeModal'])

    const toast = useToast()
    const user = toRef(props.model)
    const isLoading = ref(false)
    const userStore = useUserStore()
 
    const rules = {
        name        : { required, minLength: minLength(6),  maxLength: maxLength(30),  $autoDirty: true },
        email       : { required, minLength: minLength(10), maxLength:maxLength(40),  email: email, $autoDirty: true },
        password    : { required, minLength: minLength(6),  maxLength: maxLength(15), $autoDirty: true }    
    }
    const $v = useVuelidate(rules, user)


    function closeModal() {
        emit('closeModal')
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

            if(user.value.id) {
                await userStore.update(user.value)
            }
            else await userStore.insert(user.value)

            toast.success("Data update successfuly")
            emit('closeModal')
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