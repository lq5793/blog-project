const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456', // ⚠️ 这里改成你自己的 MySQL 密码！
    database: 'blog_system',
    waitForConnections: true,
    connectionLimit: 10
});

// 写一个测试函数，看能不能查到数据
async function testDB() {
    try {
        const [rows] = await pool.query('SELECT * FROM articles');
        console.log('📦 数据库里的文章数据：', rows);
    } catch (error) {
        console.error('❌ 数据库连接失败，请检查密码和数据库名：', error.message);
    }
}

// 调用测试
testDB();

module.exports = pool;