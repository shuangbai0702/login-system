#!/bin/bash
set -e

echo "=========================================="
echo "  部署步骤 1/3: 安装依赖 & 创建数据库"
echo "=========================================="

# ---------- 检测操作系统 ----------
if [ -f /etc/centos-release ] || [ -f /etc/aliyun-release ] || [ -f /etc/redhat-release ]; then
    OS_FAMILY="centos"
    echo "[INFO] 检测到 CentOS/AliOS 系统"
elif [ -f /etc/debian_version ] || [ -f /etc/lsb-release ] || grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
    OS_FAMILY="debian"
    echo "[INFO] 检测到 Ubuntu/Debian 系统"
else
    echo "[ERROR] 不支持的操作系统，请手动安装依赖"
    exit 1
fi

# ---------- 更新系统 & 安装基础工具 ----------
echo ""
echo "[STEP 1/5] 更新系统软件包..."
if [ "$OS_FAMILY" = "centos" ]; then
    yum install -y curl wget
else
    apt-get update -y
    apt-get install -y curl wget
fi

# ---------- 安装 Node.js 22 ----------
echo ""
echo "[STEP 2/5] 安装 Node.js 22..."
if command -v node &>/dev/null && node -v | grep -q "v22"; then
    echo "[INFO] Node.js 22 已安装: $(node -v)"
else
    if [ "$OS_FAMILY" = "centos" ]; then
        yum install -y gcc-c++ make
    else
        apt-get install -y gcc-c++ make build-essential
    fi
    curl -fsSL https://rpm.nodesource.com/setup_22.x | bash - || \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    if [ "$OS_FAMILY" = "centos" ]; then
        yum install -y nodejs
    else
        apt-get install -y nodejs
    fi
    echo "[INFO] Node.js 安装完成: $(node -v), npm: $(npm -v)"
fi

# ---------- 安装 PostgreSQL ----------
echo ""
echo "[STEP 3/5] 安装 PostgreSQL..."
if command -v psql &>/dev/null; then
    echo "[INFO] PostgreSQL 已安装: $(psql --version)"
else
    if [ "$OS_FAMILY" = "centos" ]; then
        yum install -y postgresql-server postgresql-contrib
        # 初始化数据库（如果尚未初始化）
        if ! [ -d /var/lib/pgsql/data ]; then
            postgresql-setup initdb
        fi
        systemctl enable postgresql
        systemctl start postgresql
    else
        apt-get install -y postgresql postgresql-contrib
        systemctl enable postgresql
        systemctl start postgresql
    fi
    echo "[INFO] PostgreSQL 安装完成"
fi

# 确保 PostgreSQL 正在运行
if [ "$OS_FAMILY" = "centos" ]; then
    systemctl restart postgresql
else
    systemctl restart postgresql
fi

# ---------- 创建数据库和用户 ----------
echo ""
echo "[STEP 4/5] 创建数据库用户和数据库..."
su - postgres -c "psql -c \"SELECT 1 FROM pg_roles WHERE rolname='loginuser'\"" | grep -q 1 || \
    su - postgres -c "psql -c \"CREATE USER loginuser WITH PASSWORD 'loginpass123';\""
echo "[INFO] 数据库用户 loginuser 已就绪"

su - postgres -c "psql -c \"SELECT 1 FROM pg_database WHERE datname='logindb'\"" | grep -q 1 || \
    su - postgres -c "psql -c \"CREATE DATABASE logindb OWNER loginuser;\""
echo "[INFO] 数据库 logindb 已就绪"

# 授权
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE logindb TO loginuser;\""

# ---------- 安装 pm2 ----------
echo ""
echo "[STEP 5/5] 安装 pm2..."
if command -v pm2 &>/dev/null; then
    echo "[INFO] pm2 已安装: $(pm2 -v)"
else
    npm install -g pm2
    echo "[INFO] pm2 安装完成: $(pm2 -v)"
fi

echo ""
echo "=========================================="
echo "  步骤 1/3 完成!"
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  PostgreSQL: $(psql --version)"
echo "  pm2: $(pm2 -v)"
echo "  数据库: logindb (用户: loginuser)"
echo "=========================================="
echo ""
echo "请继续执行 deploy_step2.sh 创建项目文件"
