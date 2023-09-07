import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './routing/router'

import './styles/bootstrap.scss'
import 'vueloader/dist/css/index.css'
import App from './App.vue'


createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')

import 'bootstrap/dist/js/bootstrap'