<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <user-dialog v-if="isModalVisible" :model="user" @close-modal="closeModal"></user-dialog>
    </transition>

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Users</a>
                <div class="d-flex">
                    <button type="button" class="btn btn-primary" @click="addUser">ADD</button>
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
                            Name
                        </th>
                        <th scope="col">
                            Email
                        </th>
                        <th scope="col">
                            Password
                        </th>
                        <th scope="col">
                        </th>
                        <th scope="col">
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(usr, index) in users" :key="usr.id">
                    <tr>
                        <td scope="col">
                            {{ index + 1 }}
                        </td>
                        <td scope="col" class="text-primary fw-bold">
                            {{ usr.name }}
                        </td>
                        <td scope="col">
                            {{ usr.email }}
                        </td>
                        <td scope="col">
                            {{ usr.password }}
                        </td>
                        <td>
                            <div class="form-check form-switch">
                                <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markUser(usr)" v-model="usr.status" v-bind:true-value="1" v-bind:false-value="0" >
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-sm btn-secondary" @click="editUser(usr)">edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>



    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useToast } from 'vue-toastification'
    import Loading from 'vue-loading-overlay'
    import Swal from 'sweetalert2'

    import { useUserStore } from '@/stores/UserStore'
    
    import UserDialog from '@/components/UserDialog.vue';


    const users = ref([])
    const user = ref({})
    const isLoading = ref(false)
    const isModalVisible = ref(false)

    const toast = useToast()
    const userStore = useUserStore()
    

    function addUser() {
        user.value = {}
        isModalVisible.value = true
    }
    function editUser(model) {
        user.value = model
        isModalVisible.value = true
    }
    async function markUser(model) {
        try {
            isLoading.value = true
            await userStore.mark(model)
            toast.success("Data update successfuly")
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
            loadUsers()
        }
    }

    async function loadUsers() {
        try {
            isLoading.value = true
            await userStore.retrieveAll()
            users.value = userStore.getUsers
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
        loadUsers()
    }    
    
    onMounted(async() => {
        await loadUsers()
    })
</script>

<style scoped>
</style>