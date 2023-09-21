<template>
    <div class="p-3">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand text-warning" href="#">
                    Scheduler <span class="fs-6">0.5.1</span>
                </a>
                <div v-if="authStore.getUser != null">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
        
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <button class="nav-link active" id="pills-accounts-tab" data-bs-target="tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-course" aria-selected="true">
                                    <router-link to="/course">Courses</router-link>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link active" id="pills-accounts-tab" data-bs-target="tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-subject" aria-selected="true">
                                    <router-link to="/subject">Subjects</router-link>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link active" id="pills-accounts-tab" data-bs-target="tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-location" aria-selected="true">
                                    <router-link to="/location">Locations</router-link>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link active" id="pills-accounts-tab" data-bs-target="tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-timetable" aria-selected="true">
                                    <router-link to="/timetable">Timetable</router-link>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link active" id="pills-accounts-tab" data-bs-target="tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-user" aria-selected="true">
                                    <router-link to="/user">Users</router-link>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link active" id="pills-accounts-tab" data-bs-target="tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-student" aria-selected="true">
                                    <router-link to="/student">Students</router-link>
                                </button>
                            </li>
                        </ul>
                        <ul class="d-flex mb-2 mb-lg-0">
                            <button type="button" class="btn btn-sm text-primary border border-primary" @click="logout">Logout</button>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>

    <div class="p-3 border">
        <router-view></router-view>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/AuthStore'

    const authStore = useAuthStore()
    const router = useRouter()

    function logout() {
        authStore.logout()
        router.push("/")
    }
</script>

<style scoped lang="scss">
    a {
        text-decoration: none;
        color:goldenrod;
    }
    a.router-link-active.router-link-exact-active {
        text-decoration: none;
        color: white;
        font-weight: 500;
        font-size: 1.01rem;
    }
</style>