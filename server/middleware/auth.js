/**
 * JWT 鉴权中间件
 */
const jwt = require('jsonwebtoken');

/**
 * 验证 Token 中间件
 * 在需要鉴权的路由上使用：router.get('/profile', authMiddleware, handler)
 */
function authMiddleware(req, res, next) {
  // 从请求头获取 Token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌，请先登录'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证 Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: '登录已过期，请重新登录'
      });
    }
    return res.status(401).json({
      code: 401,
      message: '无效的认证令牌'
    });
  }
}

/**
 * 生成 JWT Token
 */
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
}

module.exports = { authMiddleware, generateToken };
