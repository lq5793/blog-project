<template>
  <div style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
    <el-button @click="router.back()" style="margin-bottom: 20px;">← 返回列表</el-button>
    
    <div v-if="loading" style="text-align: center; padding: 50px 0;">
      <el-icon class="is-loading"><Loading /></el-icon> 加载中...
    </div>

    <el-card v-else-if="article" shadow="never">
      <h1 style="margin: 0 0 10px 0;">{{ article.title }}</h1>
      <div style="color: #888; font-size: 14px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
        <el-tag size="small">{{ article.category || '未分类' }}</el-tag>
        <span style="margin-left: 15px;">📅 {{ article.create_time?.replace('T', ' ')?.slice(0, 16) }}</span>
        <span style="margin-left: 15px;">👁️ {{ article.views }}</span>
      </div>
      
      <!-- Markdown 渲染区域 -->
      <div class="markdown-body" v-html="renderedContent"></div>
    </el-card>

    <el-empty v-else description="文章不存在" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '../utils/request.js'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const article = ref(null)
const loading = ref(false)

// 将 Markdown 转为 HTML
const renderedContent = computed(() => {
  if (!article.value) return ''
  return marked(article.value.content || '')
})

const fetchDetail = async () => {
  const id = route.params.id
  if (!id) return
  
  loading.value = true
  try {
    const res = await request.get(`/article/detail?id=${id}`)
    if (res.data.code === 200) {
      article.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '文章不存在')
    }
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style>
/* 美化 Markdown 样式（复制自 GitHub 风格，简洁干净） */
.markdown-body {
  line-height: 1.8;
  color: #2c3e50;
}
.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}
.markdown-body pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
}
.markdown-body code {
  background: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}
.markdown-body img {
  max-width: 100%;
}
</style>