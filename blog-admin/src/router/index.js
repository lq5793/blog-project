import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import ArticleManage from '../views/ArticleManage.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/login', component: Login, name: 'Login' },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/articles', component: ArticleManage, name: 'ArticleManage' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 新式守卫：直接返回 true / false 或路由地址
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  // 如果访问登录页，直接放行
  if (to.path === '/login') {
    return true
  }
  // 其他页面需要登录
  if (!token) {
    return '/login'
  }
  return true
})


export default router