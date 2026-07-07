<template>
  <el-container style="height: 100vh;">
    <!-- 左侧菜单 -->
    <el-aside width="200px" style="background-color: #304156; color: #fff;">
      <div style="height: 60px; line-height: 60px; text-align: center; font-size: 18px; font-weight: bold; border-bottom: 1px solid #263445;">
        📝 博客后台
      </div>
      <el-menu
        router
        :default-active="$route.path"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        style="border-right: none;"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/articles">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <el-header style="background: #fff; border-bottom: 1px solid #e6e6e6; display: flex; align-items: center; padding: 0 20px;">
        <span style="font-size: 16px; font-weight: bold;">欢迎回来，管理员</span>
      </el-header>
      <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
      <el-main style="background: #f0f2f5; padding: 20px;">
        <!-- 这里就是路由占位符，点击菜单会切换显示 Dashboard 或 ArticleManage -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { DataLine, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出')
  router.push('/login')
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.el-menu-item.is-active {
  background-color: #263445 !important;
}
</style>