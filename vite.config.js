import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@"         : path.resolve(__dirname, "src"),
            "@sweet"    : path.resolve(__dirname, "node_modules/sweetalert2"),
            "@bootstrap": path.resolve(__dirname, 'node_modules/bootstrap'),
            "@vueloader": path.resolve(__dirname, "node_modules/vue-loading-overlay"),
            "@vuetoasty": path.resolve(__dirname, "node_modules/vue-toastification"),
        }
    }
})
