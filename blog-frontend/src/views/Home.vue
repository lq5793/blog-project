<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
    <h1 style="text-align: center; margin-bottom: 30px; font-size: 32px;">📝 我的博客</h1>

    <!-- 搜索栏 -->
    <div style="display: flex; justify-content: center; margin-bottom: 30px;">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章标题..."
        clearable
        style="width: 400px; margin-right: 10px;"
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 文章列表 -->
    <el-row :gutter="30">
      <el-col :span="12" v-for="item in paginatedData" :key="item.id" style="margin-bottom: 30px;">
        <el-card shadow="hover" style="height: 100%; min-height: 220px; padding: 10px;">
          <h2 style="margin: 0 0 10px 0; font-size: 22px; color: #2c3e50;">{{ item.title }}</h2>
          <div style="color: #666; font-size: 15px; margin: 10px 0;">
            <el-tag size="medium" type="primary">{{ item.category || '未分类' }}</el-tag>
            <span style="margin-left: 15px;">👁️ {{ item.views }} 次阅读</span>
          </div>
          <p style="color: #555; font-size: 16px; line-height: 1.8; 
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; 
                    overflow: hidden; text-overflow: ellipsis;">
            {{ item.content?.slice(0, 150) || '暂无内容' }}...
          </p>
          <div style="margin-top: 20px; text-align: right;">
            <el-button type="primary" size="default" @click="goDetail(item.id)">📖 阅读全文</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页器 -->
    <div style="display: flex; justify-content: center; margin-top: 20px;">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="filteredData.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!filteredData.length && !loading" description="暂无已发布的文章" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const allArticles = ref([])      // 原始数据
const searchKeyword = ref('')    // 搜索关键词
const currentPage = ref(1)       // 当前页码
const pageSize = 6               // 每页条数
const loading = ref(false)

// 1. 获取所有已发布文章
const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get('/article/list?isPublish=1')
    if (res.data.code === 200) {
      allArticles.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
  } finally {
    loading.value = false
  }
}

// 2. 搜索过滤（基于标题）
const filteredData = computed(() => {
  if (!searchKeyword.value.trim()) {
    return allArticles.value
  }
  return allArticles.value.filter(item =>
    item.title.toLowerCase().includes(searchKeyword.value.trim().toLowerCase())
  )
})

// 3. 分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredData.value.slice(start, end)
})

// 4. 搜索时重置页码
const handleSearch = () => {
  currentPage.value = 1
}

// 5. 页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到顶部（可选）
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 6. 跳转详情
const goDetail = (id) => {
  router.push(`/detail/${id}`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.el-card:hover {
  transform: translateY(-4px);
  transition: transform 0.2s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}
</style>