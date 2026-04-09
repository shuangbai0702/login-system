/**
 * 登录系统 - 服务端入口
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 数据库自动初始化
// ============================================
async function initDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        username    VARCHAR(50)  NOT NULL,
        password    VARCHAR(255) NOT NULL,
        email       VARCHAR(100) DEFAULT NULL,
        nickname    VARCHAR(50)  DEFAULT NULL,
        avatar      VARCHAR(255) DEFAULT NULL,
        status      SMALLINT     DEFAULT 1,
        created_at  TIMESTAMP    DEFAULT NOW(),
        updated_at  TIMESTAMP    DEFAULT NOW(),
        CONSTRAINT  uk_username  UNIQUE (username),
        CONSTRAINT  uk_email     UNIQUE (email)
      )
    `);

    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await db.query(`
      DROP TRIGGER IF EXISTS users_updated_at ON users
    `);
    await db.query(`
      CREATE TRIGGER users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);

    console.log('✅ 数据库表初始化完成');
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err.message);
  }
}

// ============================================
// 中间件
// ============================================

// 解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 跨域配置 - 生产环境允许同源访问
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: true, credentials: true }));
} else {
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:8080';
  app.use(cors({ origin: clientOrigin, credentials: true }));
}

// 请求日志（开发环境）
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
  });
}

// ============================================
// API 路由
// ============================================
app.use('/api/auth', authRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 提供前端静态文件（将 login.html 放在 public 目录下）
app.use(express.static(path.join(__dirname, '..', 'public')));

// 所有其他路由返回前端页面
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// ============================================
// 全局错误处理
// ============================================
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
});

// ============================================
// 启动服务器
// ============================================
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 登录系统服务已启动');
    console.log(`   服务地址: http://localhost:${PORT}`);
    console.log(`   API 地址: http://localhost:${PORT}/api`);
    console.log('');
    console.log('📋 可用接口:');
    console.log('   POST /api/auth/register  - 用户注册');
    console.log('   POST /api/auth/login     - 用户登录');
    console.log('   GET  /api/auth/profile   - 获取用户信息（需Token）');
    console.log('   GET  /api/health         - 健康检查');
    console.log('');
  });
}

start().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});
