<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page="false" />

            <!-- <h5 v-if="newVoucher">Assign Voucher:</h5>
            <h5 v-else="!newVoucher">Edit Voucher:</h5> -->

            <div class="container p-3">
                <div class="row mb-3">
                    <div class="card p-2">
                        <div class="card-body">
                            <div class="row info">
                                <div class="col-6">
                                    <label for="classday" class="form-label">Day</label>
                                    <input id="classday" class="form-control text-center" v-model="model.classDay" readonly disabled>
                                </div>
                                <div class="col-3">
                                    <label for="classtart" class="form-label">Start</label>
                                    <div id="classstart" class="form-control" readonly disabled>{{ formatClassTime(model.classStart) }}</div>
                                </div>
                                <div class="col-3">
                                    <label for="classend" class="form-label">End</label>
                                    <div id="classend" class="form-control" readonly disabled>{{ formatClassTime(model.classEnd) }}</div>
                                </div>
                                <div class="col-12">
                                    <label for="subject" class="form-label">Subject</label>
                                    <select id="subject" v-model="model.subjectId" class="form-select">
                                        <option disabled value="0">Please Select</option>
                                        <option v-for="subject in subjects" :value="subject.id">{{subject.name}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button type="button" class="btn-green" @click="close(0)">Cancel</button>
                    &nbsp;
                    <button type="button" class="btn-green" @click="close(1)">Save</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, computed } from 'vue'
    import Loading from 'vue-loading-overlay'

    const isLoading = ref(false)
    const isProcessing = ref(false)

    const props = defineProps({
        model:      { type: Object },
        subjects:   { type: Array }
    })
    const emits = defineEmits(['close'])

    function formatClassTime(val) {
        return val.split("T")[1]
    }
    function close(opt) {
        emits('close', opt == 1 ? props.model: null)
    }

    onMounted(async () => {
    })
</script>

<style scoped>
</style>