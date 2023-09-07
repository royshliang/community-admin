<template>
    <div @close="close()" class="info">
        <div class="modal-backdrop">
            <div class="modal">
                <header class="modal-header">
                    <h5>Add new Event</h5>
                    <button type="button" class="btn-close" @click="close">x</button>
                </header>
  
                <section class="modal-body text-center">
                    <div class="card p-2">
                        <div class="card-body">
                            <div class="row info">
                                <div class="col-4">
                                    <label class="form-label">Day</label>
                                    <input class="form-control" v-model="model.day" readonly disabled>
                                </div>
                                <div class="col-4">
                                    <label for="inputPassword4" class="form-label">Start</label>
                                    <input class="form-control" v-model="model.uuid" readonly disabled>
                                </div>
                                <div class="col-4">
                                    <label for="inputPassword4" class="form-label">End</label>
                                    <input class="form-control" v-model="model.mpayReference" readonly disabled>
                                </div>
                                <div class="col-12">
                                    <label for="inputPassword4" class="form-label">Name</label>
                                    <select v-model="model.subjectId" class="form-select">
                                        <option disabled value="0">Please Select</option>
                                        <option v-for="subject in subjects" :value="subject.id">{{subject.name}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
  
                <footer class="modal-footer">
                    <button type="button" class="btn-green" @click="close">Close Modal</button>
                </footer>

                <loading :active="isLoading" :is-full-page="false" />
            </div>
        </div>    
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import Loading from 'vue-loading-overlay'

    const isLoading = ref(false)
    const isProcessing = ref(false)

    const props = defineProps({
        model: {
            type: Object
        },
        subjects: {
            type: Array
        }
    })
    const emits = defineEmits(['closeDialog'])

    onMounted(async () => {
    })
</script>

<style scoped style="scss">
    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal {
        background: #FFFFFF;
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 45%;
        /*max-width: 800px;*/ /* or any other value you prefer */
    }
    .modal-header,
    .modal-footer {
        padding: 15px;
        display: flex;
    }
    .modal-header {
        position: relative;
        border-bottom: 1px solid #eeeeee;
        color: #4AAE9B;
        justify-content: space-between;
    }
    .modal-footer {
        border-top: 1px solid #eeeeee;
        flex-direction: column;
        justify-content: flex-end;
    }
    .modal-body {
        position: relative;
        padding: 20px 10px;
    }
    .btn-close {
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        font-size: 20px;
        padding: 10px;
        cursor: pointer;
        font-weight: bold;
        color: #4AAE9B;
        background: transparent;
    }

    .btn-green {
        color: white;
        background: #4AAE9B;
        border: 1px solid #4AAE9B;
        border-radius: 2px;
    }
    input.form-control {
        font-weight: 600;
    }
    /* .info  * > *{
        font-size: 0.8rem !important;
    } */
</style>