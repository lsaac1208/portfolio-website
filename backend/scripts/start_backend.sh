#!/bin/bash

# 设置工作目录
cd /var/www/my-portfolio/backend

# 激活虚拟环境
source venv/bin/activate

# 设置 Python 路径
export PYTHONPATH=/var/www/my-portfolio/backend

# 创建日志目录
mkdir -p logs

# 数据库迁移
alembic upgrade head

# 启动 Gunicorn
exec gunicorn \
    -k uvicorn.workers.UvicornWorker \
    -w 4 \
    -b 127.0.0.1:8000 \
    -p backend.pid \
    --access-logfile logs/access.log \
    --error-logfile logs/error.log \
    --capture-output \
    app.main:app
