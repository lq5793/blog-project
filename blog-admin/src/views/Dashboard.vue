<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card shadow="hover">
          <div style="text-align: center;">
            <div style="font-size: 28px; font-weight: bold; color: #409EFF;">
              {{ stat.value }}
            </div>
            <div style="color: #909399; font-size: 14px; margin-top: 8px;">
              {{ stat.label }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 占位图表（可以使用 ECharts，但这里先简化） -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>📊 近期文章</span>
      </template>
      <el-table :data="recentArticles" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="create_time" label="发布时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request.js'

const statistics = ref([
  { label: '文章总数', value: 0 },
  { label: '已发布', value: 0 },
  { label: '草稿', value: 0 },
  { label: '总阅读量', value: 0 }
])

const recentArticles = ref([])

const fetchStats = async () => {
  try {
    const res = await request.get('/article/list')
    if (res.data.code === 200) {
      const articles = res.data.data
      statistics.value[0].value = articles.length
      statistics.value[1].value = articles.filter(a => a.is_publish === 1).length
      statistics.value[2].value = articles.filter(a => a.is_publish === 0).length
      statistics.value[3].value = articles.reduce((sum, a) => sum + (a.views || 0), 0)
      // 最近5篇文章
      recentArticles.value = articles.slice(0, 5)
    }
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>