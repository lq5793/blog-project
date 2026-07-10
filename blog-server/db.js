const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
  database: process.env.MYSQLDATABASE,
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