#!/bin/bash
# ============================================
# 登录系统 - 一键部署脚本
# 适用于：阿里云轻量应用服务器（全新 CentOS/Ubuntu/Debian）
# ============================================
set -e

echo "========================================"
echo "  登录系统 - 一键部署脚本"
echo "========================================"
echo ""

# 1. 检测系统类型并安装依赖
echo "📦 [1/7] 检测系统并安装基础依赖..."
if [ -f /etc/redhat-release ] || [ -f /etc/centos-release ] || [ -f /etc/alios-release ]; then
    echo "   检测到 CentOS/Alibaba Cloud Linux"
    yum install -y curl wget git
elif [ -f /etc/debian_version ] || [ -f /etc/lsb-release ]; then
    echo "   检测到 Ubuntu/Debian"
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y curl wget git
else
    echo "   未知系统，尝试使用通用安装..."
fi

# 2. 安装 Node.js 22.x
echo "📦 [2/7] 安装 Node.js..."
if command -v node &> /dev/null; then
    NODE_VER=$(node -v)
    echo "   Node.js 已安装: $NODE_VER"
else
    curl -fsSL https://rpm.nodesource.com/setup_22.x | bash - 2>/dev/null || \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - 2>/dev/null || \
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    if [ -f /etc/redhat-release ] || [ -f /etc/centos-release ]; then
        yum install -y nodejs
    else
        apt-get install -y nodejs
    fi
    echo "   Node.js 安装完成: $(node -v)"
fi

# 3. 安装 PostgreSQL
echo "📦 [3/7] 安装 PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "   PostgreSQL 已安装"
else
    if [ -f /etc/redhat-release ] || [ -f /etc/centos-release ] || [ -f /etc/alios-release ]; then
        yum install -y postgresql-server postgresql-contrib
        # 初始化数据库
        if [ ! -d /var/lib/pgsql/data ]; then
            postgresql-setup --initdb
        fi
        systemctl enable postgresql
        systemctl start postgresql
    else
        apt-get install -y postgresql postgresql-contrib
        systemctl enable postgresql
        systemctl start postgresql
    fi
    echo "   PostgreSQL 安装完成"
fi

# 4. 创建数据库和用户
echo "📦 [4/7] 配置数据库..."
su - postgres -c "psql -c \"SELECT 1 FROM pg_roles WHERE rolname='loginuser'\"" | grep -q 1 || \
    su - postgres -c "psql -c \"CREATE USER loginuser WITH PASSWORD 'loginpass123';\""
su - postgres -c "psql -c \"SELECT 1 FROM pg_database WHERE datname='logindb'\"" | grep -q 1 || \
    su - postgres -c "psql -c \"CREATE DATABASE logindb OWNER loginuser;\""
echo "   数据库 logindb 创建完成"

# 5. 创建项目目录和文件
echo "📦 [5/7] 部署项目文件..."
PROJECT_DIR=/opt/login-system
mkdir -p $PROJECT_DIR/server $PROJECT_DIR/public

# --- server/package.json ---
cat > $PROJECT_DIR/server/package.json << 'PKGJSON'
{
  "name": "login-system-server",
  "version": "1.0.0",
  "description": "登录系统后端服务",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.13.1"
  }
}
PKGJSON

# --- server/.env ---
cat > $PROJECT_DIR/server/.env << 'ENVFILE'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://loginuser:loginpass123@localhost:5432/logindb
JWT_SECRET=shuangbai_login_system_jwt_secret_key_2024_secure
JWT_EXPIRES_IN=24h
ENVFILE

# --- server/db.js ---
cat > $PROJECT_DIR/server/db.js << 'DBJS'
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.query('SELECT NOW()')
  .then(() => console.log('✅ 数据库连接成功'))
  .catch(err => console.error('❌ 数据库连接失败:', err.message));
module.exports = pool;
DBJS

# --- server/middleware/auth.js ---
cat > $PROJECT_DIR/server/middleware/auth.js << 'AUTHJS'
const jwt = require('jsonwebtoken');
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证令牌，请先登录' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' });
    }
    return res.status(401).json({ code: 401, message: '无效的认证令牌' });
  }
}
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
}
module.exports = { authMiddleware, generateToken };
AUTHJS

# --- server/routes/auth.js ---
cat > $PROJECT_DIR/server/routes/auth.js << 'AUTHJS'
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateToken, authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, email, nickname } = req.body;
    if (!username || !password) return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    if (username.length < 3 || username.length > 20) return res.status(400).json({ code: 400, message: '用户名长度需在 3-20 个字符之间' });
    if (password.length < 6) return res.status(400).json({ code: 400, message: '密码长度不能少于 6 位' });
    const { rows: existing } = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.length > 0) return res.status(409).json({ code: 409, message: '用户名已被注册' });
    if (email) {
      const { rows: existingEmail } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingEmail.length > 0) return res.status(409).json({ code: 409, message: '该邮箱已被注册' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { rows: [result] } = await db.query(
      'INSERT INTO users (username, password, email, nickname) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, hashedPassword, email || null, nickname || username]
    );
    const token = generateToken({ id: result.id, username });
    res.status(201).json({
      code: 201, message: '注册成功',
      data: { token, user: { id: result.id, username, email: email || null, nickname: nickname || username } }
    });
  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误，请稍后重试' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    const { rows: users } = await db.query('SELECT id, username, password, email, nickname, avatar, status FROM users WHERE username = $1', [username]);
    if (users.length === 0) return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    const user = users[0];
    if (user.status === 0) return res.status(403).json({ code: 403, message: '该账号已被禁用' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    const token = generateToken({ id: user.id, username: user.username });
    res.json({
      code: 200, message: '登录成功',
      data: { token, user: { id: user.id, username: user.username, email: user.email, nickname: user.nickname, avatar: user.avatar } }
    });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误，请稍后重试' });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { rows: users } = await db.query('SELECT id, username, email, nickname, avatar, status, created_at FROM users WHERE id = $1', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ code: 404, message: '用户不存在' });
    res.json({ code: 200, data: users[0] });
  } catch (err) {
    console.error('获取用户信息失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

module.exports = router;
AUTHJS

# --- server/index.js ---
cat > $PROJECT_DIR/server/index.js << 'INDEXJS'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3000;

async function initDatabase() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL,
      email VARCHAR(100) DEFAULT NULL, nickname VARCHAR(50) DEFAULT NULL, avatar VARCHAR(255) DEFAULT NULL,
      status SMALLINT DEFAULT 1, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT uk_username UNIQUE (username), CONSTRAINT uk_email UNIQUE (email)
    )`);
    await db.query(`CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql`);
    await db.query(`DROP TRIGGER IF EXISTS users_updated_at ON users`);
    await db.query(`CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    console.log('✅ 数据库表初始化完成');
  } catch (err) { console.error('❌ 数据库初始化失败:', err.message); }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use((req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'login.html')));
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 登录系统服务已启动');
    console.log('   服务地址: http://localhost:' + PORT);
    console.log('');
  });
}
start().catch(err => { console.error('启动失败:', err); process.exit(1); });
INDEXJS

# --- public/login.html (复制前端文件) ---
cp /workspace/public/login.html $PROJECT_DIR/public/login.html

echo "   项目文件部署完成"

# 6. 安装 Node.js 依赖
echo "📦 [6/7] 安装 Node.js 依赖..."
cd $PROJECT_DIR/server
npm install --production 2>&1 | tail -3
echo "   依赖安装完成"

# 7. 配置防火墙并启动服务
echo "📦 [7/7] 配置防火墙并启动服务..."
# 开放 3000 端口（防火墙）
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=3000/tcp 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
elif command -v ufw &> /dev/null; then
    ufw allow 3000/tcp 2>/dev/null || true
fi

# 停止之前可能运行的旧服务
pm2 delete login-system 2>/dev/null || true
pkill -f "node.*login" 2>/dev/null || true

# 使用 pm2 守护进程启动
npm install -g pm2 2>/dev/null || true
cd $PROJECT_DIR/server
pm2 start index.js --name login-system
pm2 save
pm2 startup 2>/dev/null || true

echo ""
echo "========================================"
echo "  ✅ 部署完成！"
echo "========================================"
echo ""
echo "  🌐 访问地址: http://47.100.71.68:3000"
echo ""
echo "  ⚠️  如果无法访问，请在阿里云控制台："
echo "     轻量应用服务器 -> 防火墙 -> 添加规则"
echo "     端口范围: 3000  协议: TCP"
echo ""
echo "  📋 常用命令："
echo "     pm2 logs login-system   # 查看日志"
echo "     pm2 restart login-system # 重启服务"
echo "     pm2 stop login-system    # 停止服务"
echo "========================================"
