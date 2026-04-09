/**
 * 数据库连接配置
 * 支持 PostgreSQL（使用 DATABASE_URL 环境变量）
 */
require('dotenv').config();
const { Pool } = require('pg');

// 创建数据库连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL 配置：生产环境（如 Render）通常需要 SSL
  ...(process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {})
});

// 测试数据库连接
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ 数据库连接成功');
  })
  .catch(err => {
    console.error('❌ 数据库连接失败:', err.message);
    if (process.env.NODE_ENV === 'production') {
      console.error('   请检查环境变量中的 DATABASE_URL');
    } else {
      console.error('   请检查 .env 配置文件中的 DATABASE_URL');
      console.error('   并确保已执行 init-db.sql 初始化脚本');
    }
  });

module.exports = pool;
