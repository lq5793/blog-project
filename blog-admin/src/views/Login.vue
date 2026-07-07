<template>
  <div class="login-container">
    <el-card class="login-card" style="max-width: 400px; margin: 100px auto;">
      <template #header>
        <h2 style="text-align: center; margin: 0;">📝 博客后台</h2>
      </template>
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginForm = reactive({
  username: '',
  password: ''
})
const loading = ref(false)

const handleLogin = () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }
  loading.value = true
  // 模拟登录（前端验证，账号密码写死）
  setTimeout(() => {
    // 这里可以写死一个账号，比如 admin / 123456
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      localStorage.setItem('token', 'fake-token')  // 保存登录凭证
      ElMessage.success('登录成功')
      router.push('/')  // 跳转到首页
    } else {
      ElMessage.error('账号或密码错误')
    }
    loading.value = false
  }, 500)
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  border-radius: 8px;
}
</style>