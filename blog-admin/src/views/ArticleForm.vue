<!-- 专门负责新增和编辑的弹窗 -->
<template>
  <el-dialog
    :title="formData.id ? '编辑文章' : '新增文章'"
    v-model="visible"
    width="600px"
    @close="handleClose"
  >
    <el-form :model="formData" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="formData.title" placeholder="请输入文章标题" />
      </el-form-item>
      
      <el-form-item label="分类">
        <el-input v-model="formData.category" placeholder="请输入分类，如：Vue" />
      </el-form-item>
      
      <el-form-item label="内容">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="8"
          placeholder="支持 Markdown 语法"
        />
      </el-form-item>
      
      <el-form-item label="状态">
        <el-switch
          v-model="formData.isPublish"
          :active-value="1"
          :inactive-value="0"
          active-text="发布"
          inactive-text="草稿"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        {{ formData.id ? '更新' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request.js'

// 控制弹窗显示
const visible = ref(false)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  id: null,
  title: '',
  content: '',
  category: '',
  isPublish: 1
})

// 接收父组件传来的"编辑数据"
const initData = ref(null)

// 监听弹窗打开，如果是编辑模式则回显数据
const open = (data = null) => {
  visible.value = true
  if (data) {
    // 编辑模式：把数据填进去（注意字段名转换）
    formData.id = data.id
    formData.title = data.title
    formData.content = data.content
    formData.category = data.category
    formData.isPublish = data.is_publish  // 数据库字段是 is_publish
  } else {
    // 新增模式：重置表单
    resetForm()
  }
}

// 重置表单
const resetForm = () => {
  formData.id = null
  formData.title = ''
  formData.content = ''
  formData.category = ''
  formData.isPublish = 1
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  // 简单校验
  if (!formData.title.trim() || !formData.content.trim()) {
    ElMessage.warning('标题和内容不能为空')
    return
  }
  
  submitting.value = true
  try {
    let res
    if (formData.id) {
      // 编辑
      res = await request.put('/article/update', formData)
    } else {
      // 新增
      res = await request.post('/article/add', formData)
    }
    
    if (res.data.code === 200) {
      ElMessage.success(formData.id ? '更新成功' : '新增成功')
      visible.value = false
      // 通知父组件刷新列表
      emit('success')
    } else {
      ElMessage.error(res.data.msg || '操作失败')
    }
  } catch (error) {
    ElMessage.error('请求失败，请检查网络')
  } finally {
    submitting.value = false
  }
}

// 定义事件
const emit = defineEmits(['success'])

// 暴露 open 方法给父组件
defineExpose({ open })
</script>