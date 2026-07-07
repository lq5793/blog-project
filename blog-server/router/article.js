const express = require('express');
const router = express.Router();
const pool = require('../db'); // 引入数据库连接

// 1. 获取文章列表（支持分类和发布状态筛选）
router.get('/list', async(req, res) => {
    try {
        const { category, isPublish } = req.query;
        let sql = 'SELECT * FROM articles WHERE 1=1';
        const params = [];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (isPublish !== undefined) {
            sql += ' AND is_publish = ?';
            params.push(isPublish);
        }
        sql += ' ORDER BY create_time DESC';

        const [rows] = await pool.query(sql, params);
        res.json({ code: 200, data: rows });
    } catch (error) {
        res.json({ code: 500, msg: error.message });
    }
});

// 2. 获取单篇文章详情（顺便给阅读量+1）
router.get('/detail', async(req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.json({ code: 400, msg: '缺少id参数' });

        // 先查数据
        const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
        if (rows.length === 0) return res.json({ code: 404, msg: '文章不存在' });

        // 更新阅读量（异步执行，不阻塞返回）
        await pool.query('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);

        res.json({ code: 200, data: rows[0] });
    } catch (error) {
        res.json({ code: 500, msg: error.message });
    }
});

// 3. 新增文章
router.post('/add', async(req, res) => {
    try {
        const { title, content, category, isPublish = 1 } = req.body;
        if (!title || !content) {
            return res.json({ code: 400, msg: '标题和内容不能为空' });
        }
        const sql = 'INSERT INTO articles (title, content, category, is_publish) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [title, content, category || '未分类', isPublish]);
        res.json({ code: 200, msg: '新增成功', id: result.insertId });
    } catch (error) {
        res.json({ code: 500, msg: error.message });
    }
});

// 4. 编辑文章
router.put('/update', async(req, res) => {
    try {
        const { id, title, content, category, isPublish } = req.body;
        if (!id) return res.json({ code: 400, msg: '缺少id参数' });

        const sql = 'UPDATE articles SET title=?, content=?, category=?, is_publish=? WHERE id=?';
        await pool.query(sql, [title, content, category, isPublish, id]);
        res.json({ code: 200, msg: '更新成功' });
    } catch (error) {
        res.json({ code: 500, msg: error.message });
    }
});

// 5. 删除文章
router.delete('/delete', async(req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.json({ code: 400, msg: '缺少id参数' });

        await pool.query('DELETE FROM articles WHERE id = ?', [id]);
        res.json({ code: 200, msg: '删除成功' });
    } catch (error) {
        res.json({ code: 500, msg: error.message });
    }
});

module.exports = router;