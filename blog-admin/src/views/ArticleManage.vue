<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold;">📄 文章列表</span>
        <el-button type="primary" size="small" @click="handleAdd">+ 新增文章</el-button>
      </div>
    </template>

    <el-button @click="fetchData" size="small" style="margin-bottom: 15px;">🔄 刷新数据</el-button>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="is_publish" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.is_publish ? 'success' : 'info'">
            {{ row.is_publish ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="阅读量" width="100" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" plain @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" plain @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
<ArticleForm ref="formRef" @success="fetchData" />
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import ArticleForm from './ArticleForm.vue'
import { ref, onMounted } from 'vue';
import request from '../utils/request.js';

const tableData = ref([]);
const formRef = ref(null)

// 获取数据
const fetchData = async () => {
  try {
    const res = await request.get('/article/list');
    if (res.data.code === 200) {
      tableData.value = res.data.data;
    }
  } catch (error) {
    ElMessage.error('加载数据失败');
  }
};

// 修改"新增"和"编辑"的事件处理
const handleAdd = () => {
  formRef.value.open()  // 无参数 = 新增模式
}

const handleEdit = (row) => {
  formRef.value.open(row)  // 传 row = 编辑模式
}

// 删除
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    const res = await request.delete(`/article/delete?id=${id}`)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      fetchData()  // 刷新列表
    } else {
      ElMessage.error(res.data.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 页面加载时自动获取数据
onMounted(() => {
  fetchData();
});
</script>