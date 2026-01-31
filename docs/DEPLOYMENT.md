# 部署指南

本指南介绍如何将个人能力展示网站部署到生产环境。

## 环境要求

| 组件 | 要求 |
|------|------|
| Python | 3.13+ |
| Node.js | 20+ |
| 内存 | 最少 1GB |
| 磁盘 | 最少 10GB |

## 1. 后端部署

### 1.1 创建虚拟环境

```bash
cd /var/www/portfolio
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### 1.2 配置环境变量

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件设置生产环境配置
```

关键配置：

```env
# 使用强密钥
SECRET_KEY=your-very-long-random-secret-key

# 生产数据库 (推荐 PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost/portfolio

# 禁用调试模式
DEBUG=False

# 设置允许的域名
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
```

### 1.3 数据库迁移

```bash
cd backend
alembic upgrade head
```

### 1.4 使用 Gunicorn 启动

```bash
cd backend
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --access-logfile logs/access.log \
    --error-logfile logs/error.log
```

### 1.5 使用 Systemd 管理

创建服务文件 `/etc/systemd/system/portfolio-backend.service`：

```ini
[Unit]
Description=Portfolio Backend API
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/portfolio/backend
Environment="PATH=/var/www/portfolio/venv/bin"
Environment="PYTHONPATH=/var/www/portfolio/backend"
ExecStart=/var/www/portfolio/venv/bin/gunicorn app.main:app \
    -w 4 \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --access-logfile /var/www/portfolio/logs/access.log \
    --error-logfile /var/www/portfolio/logs/error.log

Restart=always
RestartSec=5

# 日志权限
StandardOutput=file:/var/www/portfolio/logs/stdout.log
StandardError=file:/var/www/portfolio/logs/stderr.log

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio-backend
sudo systemctl start portfolio-backend
sudo systemctl status portfolio-backend
```

### 1.6 Supervisor 配置 (备选)

安装 Supervisor：

```bash
sudo apt install supervisor
```

创建配置文件 `/etc/supervisor/conf.d/portfolio-backend.conf`：

```ini
[program:portfolio-backend]
command=/var/www/portfolio/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
directory=/var/www/portfolio/backend
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/www/portfolio/logs/supervisor.err.log
stdout_logfile=/var/www/portfolio/logs/supervisor.out.log
environment="PATH=/var/www/portfolio/venv/bin"
```

启动：

```bash
sudo supervisorctl update
sudo supervisorctl start portfolio-backend
```

## 2. 前端部署

### 2.1 构建应用

```bash
cd /var/www/portfolio/frontend
npm install
npm run build
```

### 2.2 使用 PM2 管理 Node 进程 (备选)

```bash
npm install -g pm2
pm2 start npm --name "portfolio-frontend" -- run start --prefix /var/www/portfolio/frontend
pm2 save
pm2 startup
```

### 2.3 使用 Systemd 管理

创建服务文件 `/etc/systemd/system/portfolio-frontend.service`：

```ini
[Unit]
Description=Portfolio Frontend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/portfolio/frontend
ExecStart=/usr/bin/npm run start --prefix /var/www/portfolio/frontend
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=NEXT_PUBLIC_API_URL=https://api.your-domain.com

[Install]
WantedBy=multi-user.target
```

## 3. Nginx 配置

### 3.1 安装 Nginx

```bash
sudo apt install nginx
```

### 3.2 创建配置文件

```nginx
# /etc/nginx/sites-available/portfolio

upstream backend {
    server 127.0.0.1:8000;
    keepalive 32;
}

upstream frontend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# 重定向 HTTP 到 HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$host$request_uri;
}

# 主站点 (Next.js 前端)
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;

    # 前端静态文件
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }

    # Swagger UI
    location /docs/ {
        proxy_pass http://backend/docs/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3.3 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. SSL 证书

使用 Let's Encrypt 免费证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

设置自动续期：

```bash
sudo crontab -e
# 添加
0 12 * * * /usr/bin/certbot renew --quiet
```

## 5. 监控配置

### 5.1 日志位置

| 日志 | 位置 |
|------|------|
| Nginx 访问日志 | `/var/log/nginx/access.log` |
| Nginx 错误日志 | `/var/log/nginx/error.log` |
| 应用访问日志 | `/var/www/portfolio/logs/access.log` |
| 应用错误日志 | `/var/www/portfolio/logs/error.log` |
| Gunicorn 日志 | `/var/www/portfolio/logs/*.log` |

### 5.2 错误告警

可以配置日志监控告警。以下是一个简单的错误监控脚本：

```bash
#!/bin/bash
# check_errors.sh

ERROR_LOG="/var/www/portfolio/logs/error.log"
ALERT_EMAIL="admin@your-domain.com"

# 检查最近一小时的错误
if tail -n 100 "$ERROR_LOG" | grep -q "ERROR"; then
    echo "发现新的应用错误，请检查日志" | mail -s "[Portfolio] 应用错误告警" "$ALERT_EMAIL"
fi
```

添加到 crontab：

```bash
0 * * * * /var/www/portfolio/scripts/check_errors.sh
```

### 5.3 使用 Sentry 进行错误追踪 (可选)

```bash
pip install sentry-sdk
```

在 `backend/app/main.py` 中添加：

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    integrations=[
        FastApiIntegration(),
        SqlalchemyIntegration(),
    ],
    traces_sample_rate=1.0,
)
```

## 6. 备份策略

### 6.1 数据库备份

创建备份脚本 `/var/www/portfolio/scripts/backup.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/var/www/portfolio/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump postgresql://user:password@localhost/portfolio > $BACKUP_DIR/portfolio_$DATE.sql

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# 上传到云存储 (可选)
# aws s3 cp $BACKUP_DIR/portfolio_$DATE.sql s3://your-backup-bucket/
```

添加 crontab：

```bash
0 3 * * * /var/www/portfolio/scripts/backup.sh
```

### 6.2 文件备份

```bash
# 备份上传的文件
rsync -av /var/www/portfolio/uploads /var/www/portfolio/backups/uploads/
```

## 7. 更新部署

### 7.1 后端更新

```bash
cd /var/www/portfolio/backend
git pull origin main
source ../venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart portfolio-backend
```

### 7.2 前端更新

```bash
cd /var/www/portfolio/frontend
git pull origin main
npm install
npm run build
sudo systemctl restart portfolio-frontend
```

## 8. Docker 部署 (可选)

### 8.1 后端 Dockerfile

```dockerfile
FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 8.2 前端 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### 8.3 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/portfolio
      - SECRET_KEY=your-secret-key
    depends_on:
      - db
    volumes:
      - logs:/app/logs

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/out:/usr/share/nginx/html:ro
    depends_on:
      - backend
      - frontend

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=portfolio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
  logs:
```

## 9. 验证部署

### 9.1 检查服务状态

```bash
# 检查后端
curl http://localhost:8000/health

# 检查前端
curl http://localhost:3000

# 检查 API
curl http://localhost:8000/docs
```

### 9.2 检查日志

```bash
# 查看后端错误日志
tail -f /var/www/portfolio/logs/error.log

# 查看 Nginx 错误
tail -f /var/log/nginx/error.log
```

### 9.3 性能测试

使用 `wrk` 进行压力测试：

```bash
wrk -t12 -c400 -d30s http://localhost:8000/api/blog/posts
```
