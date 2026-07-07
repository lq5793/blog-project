import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // 你后端跑的地址
                changeOrigin: true,
                rewrite: (path) => path // 不重写路径，保留 /api
            }
        }
    }
})