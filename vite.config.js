import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src'),
            "vueloader": path.resolve(__dirname, "node_modules/vue-loading-overlay"),
            "bootstrap": path.resolve(__dirname, "node_modules/bootstrap")
        }
    }
})
