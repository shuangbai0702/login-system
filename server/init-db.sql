-- ============================================
-- 登录系统 - 数据库初始化脚本（PostgreSQL）
-- 使用方法：
--   psql -U postgres -f init-db.sql
-- 或在 psql 交互中执行：
--   \i init-db.sql
-- ============================================

-- 创建用户表
DROP TABLE IF EXISTS users;
CREATE TABLE users (
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
);

-- 为 updated_at 创建自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 添加表注释
COMMENT ON TABLE  users IS '用户表';
COMMENT ON COLUMN users.id         IS '用户ID';
COMMENT ON COLUMN users.username   IS '用户名';
COMMENT ON COLUMN users.password   IS '加密后的密码';
COMMENT ON COLUMN users.email      IS '邮箱';
COMMENT ON COLUMN users.nickname   IS '昵称';
COMMENT ON COLUMN users.avatar     IS '头像URL';
COMMENT ON COLUMN users.status     IS '状态：1=正常，0=禁用';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';

-- 插入一个默认测试账号（密码：123456）
-- bcrypt hash of '123456'
INSERT INTO users (username, password, email, nickname) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@example.com', '管理员');
