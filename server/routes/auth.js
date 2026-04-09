/**
 * 用户认证路由 - 注册 / 登录
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================================
// POST /api/auth/register - 用户注册
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, nickname } = req.body;

    // 参数校验
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空'
      });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        code: 400,
        message: '用户名长度需在 3-20 个字符之间'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        code: 400,
        message: '密码长度不能少于 6 位'
      });
    }

    // 检查用户名是否已存在
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        code: 409,
        message: '用户名已被注册'
      });
    }

    // 检查邮箱是否已存在
    if (email) {
      const [existingEmail] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      if (existingEmail.length > 0) {
        return res.status(409).json({
          code: 409,
          message: '该邮箱已被注册'
        });
      }
    }

    // 加密密码（salt rounds = 10）
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 插入用户
    const [result] = await db.query(
      'INSERT INTO users (username, password, email, nickname) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email || null, nickname || username]
    );

    // 生成 Token
    const token = generateToken({
      id: result.insertId,
      username: username
    });

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        token,
        user: {
          id: result.insertId,
          username,
          email: email || null,
          nickname: nickname || username
        }
      }
    });

  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误，请稍后重试'
    });
  }
});

// ============================================
// POST /api/auth/login - 用户登录
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 参数校验
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空'
      });
    }

    // 查找用户
    const [users] = await db.query(
      'SELECT id, username, password, email, nickname, avatar, status FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 检查账号状态
    if (user.status === 0) {
      return res.status(403).json({
        code: 403,
        message: '该账号已被禁用，请联系管理员'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    // 生成 Token
    const token = generateToken({
      id: user.id,
      username: user.username
    });

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar
        }
      }
    });

  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误，请稍后重试'
    });
  }
});

// ============================================
// GET /api/auth/profile - 获取当前用户信息（需鉴权）
// ============================================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, nickname, avatar, status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      data: users[0]
    });

  } catch (err) {
    console.error('获取用户信息失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;
