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
                                    <label for="day" class="form-label">Day</label>
                                    <input id="day" class="form-control text-center" v-model="timetable.classDay" readonly disabled>
                                </div>
                                <div class="col-3">
                                    <label for="classtart" class="form-label">Start</label>
                                    <div id="classstart" class="form-control" readonly disabled>{{ formatClassTime(timetable.startTime) }}</div>
                                </div>
                                <div class="col-3">
                                    <label for="classend" class="form-label">End</label>
                                    <div id="classend" class="form-control" readonly disabled>{{ formatClassTime(timetable.endTime) }}</div>
                                </div>
                                <div class="col-12">
                                    <label for="subject" class="form-label">Subject</label>
                                    <select id="subject" v-model="timetable.subjectId" class="form-select">
                                        <option v-for="(opt, index) in subjects" :key="index" :value="opt.subjectId">{{ opt.subjectName }}</option>
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
    import { ref, onMounted, onUnmounted, computed, toRef } from 'vue'
    import { useSubjectStore } from '@/stores/SubjectStore'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'

    const props = defineProps(['model', 'course'])
    const emit = defineEmits(['closeDialog'])

    const subjectStore = useSubjectStore()

    const subjects = ref([])
    const timetable = toRef(props.model)
    const isLoading = ref(false)

    async function loadSubjects(courseId) {
        try {
            isLoading.value = true
            await subjectStore.retrieveByCourse(courseId)
            subjects.value = subjectStore.getActiveSubjects
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }
    function formatClassTime(val) {
         return val.split("T")[1]
    }
    function close() {
        emit('closeDialog', timetable.value)
    }


    onMounted(async () => {
        await loadSubjects(props.course)
    })
</script>

<script>
    // import { ref, onMounted, onUnmounted, computed } from 'vue'
    // import Loading from 'vue-loading-overlay'

    // const props = defineProps({
    //     model:      { type: Object },
    //     subjects:   { type: Array }
    // })
    // const emits = defineEmits(['close'])

    // const isLoading = ref(false)
    // const timetable = ref(props.model)
    // const isProcessing = ref(false)


    // function formatClassTime(val) {
    //     debugger;
    //     return val.split("T")[1]
    // }
    // function close(opt) {
    //     debugger;
    //     emits('close', opt == 1 ? timetable.value: null)
    // }

    // onMounted(async () => {
    // })
</script>

<style scoped>
</style>