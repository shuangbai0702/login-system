#!/bin/bash
set -e

echo "=========================================="
echo "  部署步骤 3/3: 安装依赖 & 启动服务"
echo "=========================================="

PROJECT_DIR="/opt/login-system"
SERVER_DIR="$PROJECT_DIR/server"
APP_NAME="login-system"

# ---------- 停止已有服务 ----------
echo ""
echo "[STEP 1/4] 停止已有服务..."
if command -v pm2 &>/dev/null; then
    pm2 delete "$APP_NAME" 2>/dev/null || true
    echo "[INFO] pm2 已停止旧进程"
fi
pkill -f "node $SERVER_DIR/index.js" 2>/dev/null || true
echo "[INFO] 已清理旧进程"

# ---------- 安装 npm 依赖 ----------
echo ""
echo "[STEP 2/4] 安装 npm 依赖..."
cd "$SERVER_DIR"
npm install --production
echo "[INFO] npm 依赖安装完成"

# ---------- 配置 PostgreSQL 认证 ----------
echo ""
echo "[STEP 3/4] 配置 PostgreSQL 认证..."
# 确保 pg_hba.conf 允许本地密码认证
PG_HBA_CONF=$(find /etc/postgresql -name "pg_hba.conf" 2>/dev/null | head -1)
if [ -z "$PG_HBA_CONF" ]; then
    PG_HBA_CONF="/var/lib/pgsql/data/pg_hba.conf"
fi

if [ -f "$PG_HBA_CONF" ]; then
    # 备份原文件
    cp "$PG_HBA_CONF" "${PG_HBA_CONF}.bak.$(date +%s)"
    # 将所有 local 的 peer/md5 认证改为 md5
    sed -i 's/^local\s\+all\s\+all\s\+peer/local  all  all  md5/' "$PG_HBA_CONF" 2>/dev/null || true
    sed -i 's/^local\s\+all\s\+all\s\+ident/local  all  all  md5/' "$PG_HBA_CONF" 2>/dev/null || true
    sed -i 's/^host\s\+all\s\+all\s\+127\.0\.0\.1\/32\s\+ident/host  all  all  127.0.0.1\/32  md5/' "$PG_HBA_CONF" 2>/dev/null || true
    sed -i 's/^host\s\+all\s\+all\s\+::1\/128\s\+ident/host  all  all  ::1\/128  md5/' "$PG_HBA_CONF" 2>/dev/null || true
    echo "[INFO] pg_hba.conf 已更新"

    # 重启 PostgreSQL 使配置生效
    if [ -f /etc/centos-release ] || [ -f /etc/aliyun-release ] || [ -f /etc/redhat-release ]; then
        systemctl restart postgresql
    else
        systemctl restart postgresql
    fi
    echo "[INFO] PostgreSQL 已重启"
else
    echo "[WARN] 未找到 pg_hba.conf，跳过认证配置"
fi

# ---------- 使用 pm2 启动服务 ----------
echo ""
echo "[STEP 4/4] 使用 pm2 启动服务..."
cd "$SERVER_DIR"
pm2 start index.js --name "$APP_NAME"
pm2 save
pm2 startup 2>/dev/null || true
echo "[INFO] pm2 服务已启动"

# ---------- 验证服务 ----------
echo ""
echo "等待服务启动..."
sleep 3

echo ""
echo "=========================================="
echo "  部署完成!"
echo "=========================================="
echo ""
echo "  服务名称: $APP_NAME"
echo "  项目目录: $PROJECT_DIR"
echo "  服务地址: http://localhost:3000"
echo ""
echo "  常用命令:"
echo "    pm2 status              - 查看服务状态"
echo "    pm2 logs $APP_NAME      - 查看日志"
echo "    pm2 restart $APP_NAME   - 重启服务"
echo "    pm2 stop $APP_NAME      - 停止服务"
echo "    pm2 delete $APP_NAME    - 删除服务"
echo ""
echo "  测试命令:"
echo "    curl http://localhost:3000/api/health"
echo ""
echo "=========================================="
