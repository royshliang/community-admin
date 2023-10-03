import { createRouter, createWebHistory, createWebHashHistory } from "vue-router"

import LoginPage      from '@/pages/LoginPage.vue'
import UserPage       from '@/pages/UserPage.vue'
import LocationPage   from '@/pages/LocationPage.vue'
import CoursePage     from "@/pages/CoursePage.vue"
import StudentPage    from "@/pages/StudentPage.vue"
import SubjectPage    from "@/pages/SubjectPage.vue"
import TimetablePage  from "@/pages/TimetablePage.vue"
import EventtablePage from "@/pages/EventtablePage.vue"
import { useUserStore } from "../stores/UserStore"

const router = new createRouter({
	history: createWebHashHistory(),
	routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/course',
            name: 'Courses',
            component: CoursePage,
        },
        {
            path: '/location',
            name: 'Locations',
            component: LocationPage,
        },
        {
            path: '/student',
            name: 'Students',
            component: StudentPage,
        },
        {
            path: '/user',
            name: 'Users',
            component: UserPage,
        },        
        {
            path: '/subject',
            name: 'Subjects',
            component: SubjectPage
        },
        {
            path: '/timetable',
            name: 'Timetable',
            component: TimetablePage
        },
        {
            path: '/eventtable',
            name: 'EventTable',
            component: EventtablePage
        }
	],
})


// ----- security authentication
router.beforeEach(to => {
    const userStore = useUserStore()

	if (to.fullPath != "/login" && !userStore.getUser) {
        return "/login"
	}
})


export default router
