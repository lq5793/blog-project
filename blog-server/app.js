const express = require('express');
const app = express();
const port = 3000;

// 允许前端跨域调用
app.use(require('cors')());
// 让后端能解析前端传来的 JSON 数据
app.use(express.json());

// 健康检查路由（Railway 默认检查 /）
app.get('/', (req, res) => {
  res.status(200).send('OK');
});
// 或者针对 /health 路径
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 引入文章路由
const articleRouter = require('./router/article');
// 所有以 /api/article 开头的请求，都交给 articleRouter 处理
app.use('/api/article', articleRouter);

// const db = require('./db'); // 放在 app.listen 上面

// 启动服务器
app.listen(port, () => {
    // console.log(`✅ 后端服务已启动，地址: http://localhost:3000`);
    console.log(`✅ 后端服务已启动，地址: http://localhost:${port}`);
});