/**
 * 登录系统 - 服务端入口
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 中间件
// ============================================

// 解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 跨域配置
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:8080';
app.use(cors({
  origin: clientOrigin,
  credentials: true
}));

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
