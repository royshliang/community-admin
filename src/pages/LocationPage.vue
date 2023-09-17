<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <location-dialog v-if="isModalVisible" :model="location" @close-modal="closeModal"></location-dialog>
    </transition>


    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Locations</a>
                <div class="d-flex">
                    <button type="button" class="btn btn-primary" @click="addLocation">ADD</button>
                </div>
            </div>
        </nav>
        <hr/>
        <div class="container justify-content-center">
            <table class="table">
                <thead>
                    <tr> 
                        <th scope="col"></th>
                        <th scope="col">
                            Code
                        </th>
                        <th scope="col" class="col-6">
                            Description
                        </th>
                        <th></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody v-for="(loc, index) in locations" :key="loc.id">
                    <tr>
                        <td scope="col">
                            {{ index + 1 }}
                        </td>
                        <td scope="col" class="text-primary fw-bold">
                            {{ loc.code }}
                        </td>
                        <td scope="col" class="text-primary col-6">
                            {{ loc.description }}
                        </td>
                        <td>
                            <div class="form-check form-switch">
                                <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markLocation(loc)" v-model="loc.status" v-bind:true-value="1" v-bind:false-value="0" >
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-sm btn-secondary" @click="editLocation(loc)">edit</button>
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

    import { useLocationStore } from '@/stores/LocationStore'
    
    import LocationDialog from '@/components/LocationDialog.vue';


    const locations = ref([])
    const location = ref({})
    const isLoading = ref(false)
    const isModalVisible = ref(false)

    const toast = useToast()
    const locationStore = useLocationStore()
    

    function addLocation() {
        location.value = {}
        isModalVisible.value = true
    }
    function editLocation(model) {
        location.value = model
        isModalVisible.value = true
    }
    async function markLocation(model) {
        try {
            isLoading.value = true
            await locationStore.mark(model)
            toast.success("Data update successfuly")
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
            loadLocations()
        }
    }

    async function loadLocations() {
        try {
            isLoading.value = true
            await locationStore.retrieveAll()
            locations.value = locationStore.getLocations
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
        loadLocations()
    }    
    
    onMounted(async() => {
        await loadLocations()
    })
</script>

<style scoped>
</style>