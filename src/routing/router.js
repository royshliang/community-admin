import { createRouter, createWebHistory } from "vue-router"

import UserPage       from '@/pages/UserPage.vue'
import LocationPage   from '@/pages/LocationPage.vue'
import CoursePage     from "@/pages/CoursePage.vue"
import StudentPage    from "@/pages/StudentPage.vue"
import SubjectPage    from "@/pages/SubjectPage.vue"
import TimetablePage  from "@/pages/TimetablePage.vue"
import EventtablePage from "@/pages/EventtablePage.vue"

const router = new createRouter({
	history: createWebHistory(),
	routes: [
        {
            path: '/',
            redirect: '/course',
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

export default router

// ----- security authentication
// import useAuthStore from "@/stores/AuthStore"
// router.beforeEach(async (to) => {
// 	debugger

// 	if (to.fullPath != "/login") {
// 		if (to.fullPath == "/company" || to.fullPath == "/grade") {
// 			const authStore = useAuthStore()

// 			if (!authStore.isUserLoggedIn) {
// 				await router.push("/login")
// 			}
// 		}
// 	}
// })
