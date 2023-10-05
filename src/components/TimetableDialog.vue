<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page="false" />

            <div class="col-12 text-center bg-dark text-light">
                <h5 v-if="timetable.id < 0">Add Event</h5>
                <h5 v-else>Edit event:</h5>
            </div>

            <div class="container p-3">
                <div class="row mb-3">
                    <div class="card p-2">
                        <div class="card-body">
                            <div class="row info">
                                <div class="row mb-3">
                                    <div class="col-6">
                                        <label for="day" class="form-label">Day</label>
                                        <!-- <input id="day" class="form-control text-center" v-model="timetable.classDay" readonly disabled> -->
                                        <input id="day" class="form-control text-center fw-bold" :value="formatDayName(timetable.classDay)" readonly disabled>
                                    </div>
                                    <div class="col-3">
                                        <label for="classtart" class="form-label">Start</label>
                                        <input id="day" class="form-control text-center fw-bold" :value="formatClassTime(timetable.startTime)" readonly disabled>
                                        <!-- <div id="classstart" class="form-control text-center" readonly disabled>{{ formatClassTime(timetable.startTime) }}</div> -->
                                    </div>
                                    <div class="col-3">
                                        <label for="classend" class="form-label">End</label>
                                        <input id="day" class="form-control text-center fw-bold" :value="formatClassTime(timetable.endTime) " readonly disabled>
                                        <!-- <div id="classend" class="form-control text-center" readonly disabled>{{ formatClassTime(timetable.endTime) }}</div> -->
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <label for="subject" class="form-label">Subject</label>
                                        <select id="subject" v-model="timetable.subjectId" class="form-select">
                                            <option v-if="timetable.subjectId <= 0" value="-1" selected disabled>Please select a subject</option>
                                            <option v-for="(sub, key, index) in subjectList" :key="sub.id" :value="sub.subjectId">{{ sub.subjectName }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <label for="location" class="form-label">Location</label>
                                        <select id="location" v-model="timetable.locationId" class="form-select">
                                            <option v-if="timetable.locationId <= 0" value="-1" selected disabled>Please select a location</option>
                                            <option v-for="loc in locationList" :key="loc.id" :value="loc.id">
                                                <span class="fw-bold">{{ loc.code }}</span>-<span>loc.description</span>
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
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
    </div>
</template>


<script setup>
    import { ref, toRef } from 'vue'
    import Loading from 'vue-loading-overlay'

    const emit = defineEmits(['dialogClosed'])
    const props = defineProps(['model', 'subjectList', 'locationList'])

    const timetable = toRef(props.model)
    const isLoading = ref(false)

    const dayNameList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


    function formatClassTime(val) {
        return val.split("T")[1]
    }
    function formatDayName(val) {
        return dayNameList[val-1]
    }

    function closeDialog() {
        emit('dialogClosed', 0)
    }
    function saveDialog() {
        debugger;

        timetable.value.locationCode = props.locationList.find(x => x.id == timetable.value.locationId)?.code;
        timetable.value.locationName = props.locationList.find(x => x.id == timetable.value.locationId)?.description;
        timetable.value.subjectName = props.subjectList.find(x => x.subjectId == timetable.value.subjectId)?.subjectName;

        emit('dialogClosed', timetable.value)
    }
</script>

<style scoped>
</style>