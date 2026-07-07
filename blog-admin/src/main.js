import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 1. 导入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 2. 导入路由（马上要建）
import router from './router'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')