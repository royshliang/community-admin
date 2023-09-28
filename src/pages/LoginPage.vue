<template>
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-xl-10">
                <div class="card" style="border-radius: 1rem;">
                    <div class="row g-0 h-75">
                        <div class="col-md-6 col-lg-5 d-none d-md-block">
                        <img src="https://university.help.edu.my/wp-content/uploads/2022/10/SciFeeling.jpg"
                            alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem; width: 100%; height: 100%;" />
                        </div>

                        <div class="col-md-6 col-lg-7 d-flex align-items-center">
                            <loading :active="isLoading" is-full-screen="false"></loading>

                            <div class="card-body p-4 p-lg-5 text-black">
                                <!-- 
                                <div class="d-flex align-items-center mb-2 pb-1">
                                    <i class="fas fa-cubes fa-2x me-3" style="color: #ff6219;"></i>
                                    <span class="h1 fw-bold mb-0">Logo</span>
                                </div> 
                                -->

                                <h5 class="fw-normal mb-2 pb-2" style="letter-spacing: 1px;">Sign into your account</h5>

                                <div class="form-outline mb-2">
                                    <label class="form-label" for="email">Email</label>
                                    <input type="email" id="email" class="form-control form-control-lg" v-model="credentials.email" :class="{ 'border-danger': $v.email.$dirty && $v.email.$invalid }">
                                    <div v-if="$v.email.$dirty && $v.email.required.$invalid" style="color: red">This field is required</div>
                                    <div v-if="$v.email.$dirty && $v.email.email.$invalid" style="color: red">Invalid email format</div>
                                </div>

                                <div class="form-outline mb-2">
                                    <label class="form-label" for="pwd">Password</label>
                                    <input type="password" id="pwd" class="form-control form-control-lg" v-model="credentials.pwd" :class="{ 'border-danger': $v.pwd.$dirty && $v.pwd.$invalid }">
                                    <div v-if="$v.pwd.$dirty && $v.pwd.required.$invalid" style="color: red">This field is required</div>
                                </div>

                                <div class="pt-1 mb-3">
                                    <button class="btn btn-dark btn-lg btn-block" type="button" @click="login" :disabled="isLoading">Login</button>
                                </div>

                                <a href="#!" class="small text-muted">Terms of use.</a>
                                <a href="#!" class="small text-muted">Privacy policy</a>
                            </div>
                        </div>
                        <!--
                        <div v-else class="col-md-6 col-lg-7 d-flex align-items-center">
                            <div class="card-body p-4">
                                login dy !!!!
                            </div>
                        </div> 
                        -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import Swal from 'sweetalert2'
    import { useToast } from 'vue-toastification'
    import { useRouter } from 'vue-router'
    import { useUserStore } from '@/stores/UserStore'
    import Loading from 'vue-loading-overlay'

    import { useVuelidate } from '@vuelidate/core'
    import { required, email } from '@vuelidate/validators'

    const credentials = ref({email: null, pwd: null})
    const isLoading = ref(false)

    const toast = useToast()
    const router = useRouter()
    const userStore = useUserStore()

    const rules = {
        email  : { required, email: email, $autoDirty: true },
        pwd    : { required, $autoDirty: true }
    }
    const $v = useVuelidate(rules, credentials)

    async function login() {
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
            await userStore.authenticate({
                email: credentials.value.email, 
                password: credentials.value.pwd
            })

            if(userStore.getUser != null) {
                toast.success("Authentication successful")
                router.push("/course")
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Authentication Error',
                    text: 'Invalid email/password'
                })
            }
        }
        catch(err) {
            Swal.fire({ icon: 'warning', title: 'Error authenticating' })
        }
        finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
        if(userStore.getUser != null) {
            router.push("/course")
        }
    })
</script>