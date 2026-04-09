/**
 * 数据库连接配置
 * 支持 TiDB Cloud / 标准 MySQL
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'login_system',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// TiDB Cloud / 云数据库通常需要 SSL 连接
if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = {};
}

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
pool.getConnection()
  .then(conn => {
    console.log('✅ 数据库连接成功');
    conn.release();
  })
  .catch(err => {
    console.error('❌ 数据库连接失败:', err.message);
    if (process.env.NODE_ENV === 'production') {
      console.error('   请检查环境变量中的数据库连接信息');
    } else {
      console.error('   请检查 .env 配置文件中的数据库连接信息');
      console.error('   并确保已执行 init-db.sql 初始化脚本');
    }
  });

module.exports = pool;
