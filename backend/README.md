# 个人能力展示网站 - 后端 API

集博客、论坛、项目展示、作品集展示于一体的综合性个人网站后端服务。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | FastAPI 0.110+ |
| 语言 | Python 3.13+ |
| ORM | SQLAlchemy 2.0+ |
| 数据库 | SQLite (可迁移到 PostgreSQL) |
| 认证 | JWT (python-jose) |
| 验证 | Pydantic 2.0+ |
| 文档 | Swagger UI / ReDoc |
| 测试 | pytest |

## 快速开始

### 1. 安装依赖

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或: venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### 2. 环境变量配置

创建 `.env` 文件：

```bash
cp .env.example .env
```

主要配置项：

```env
# 应用配置
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 数据库
DATABASE_URL=sqlite:///./portfolio.db

# 邮件配置 (可选)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@example.com

# 前端 URL (用于 CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. 启动服务

开发模式：

```bash
uvicorn app.main:app --reload
```

生产模式：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 4. 访问文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 项目结构

```
backend/
├── app/
│   ├── main.py                 # FastAPI 应用入口
│   ├── api/
│   │   ├── deps.py             # 依赖注入
│   │   └── routes/
│   │       ├── auth.py         # 认证路由 (注册/登录/刷新Token)
│   │       ├── blog.py         # 博客路由
│   │       ├── forum.py        # 论坛路由
│   │       ├── projects.py     # 项目路由
│   │       ├── portfolio.py    # 作品集路由
│   │       ├── services.py     # 服务/询价/订单路由
│   │       ├── contact.py      # 联系表单路由
│   │       └── users.py        # 用户管理路由
│   ├── core/
│   │   ├── config.py           # 配置管理
│   │   ├── security.py         # 安全相关 (密码/Token)
│   │   └── logging_config.py   # 日志配置
│   ├── models/
│   │   └── models.py           # SQLAlchemy 数据模型
│   ├── schemas/
│   │   └── *.py                # Pydantic 模式定义
│   ├── db/
│   │   ├── base.py             # 数据库初始化
│   │   └── session.py          # 数据库会话
│   ├── lib/
│   │   └── utils.py            # 工具函数
│   └── services/               # 服务层逻辑
├── tests/
│   ├── __init__.py
│   └── test_api.py             # API 测试用例
├── alembic/                    # 数据库迁移
├── logs/                       # 日志文件目录
├── requirements.txt
├── pytest.ini
└── alembic.ini
```

## API 文档

### 认证 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 公开 |
| POST | /api/auth/login | 用户登录 | 公开 |
| POST | /api/auth/refresh | 刷新 Token | 公开 |
| GET | /api/auth/me | 获取当前用户 | 需要认证 |

### 博客 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/blog/posts | 获取文章列表 | 公开 |
| GET | /api/blog/posts/{slug} | 获取文章详情 | 公开 |
| POST | /api/blog/posts | 创建文章 | 需要认证 |
| PUT | /api/blog/posts/{slug} | 更新文章 | 需要认证 |
| DELETE | /api/blog/posts/{slug} | 删除文章 | 需要认证 |

### 论坛 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/forum/topics | 获取话题列表 | 公开 |
| GET | /api/forum/topics/{id} | 获取话题详情 | 公开 |
| POST | /api/forum/topics | 创建话题 | 需要认证 |
| PUT | /api/forum/topics/{id} | 更新话题 | 需要认证 |
| DELETE | /api/forum/topics/{id} | 删除话题 | 需要认证 |

### 项目展示 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/projects | 获取项目列表 | 公开 |
| GET | /api/projects/{slug} | 获取项目详情 | 公开 |
| POST | /api/projects | 创建项目 | 需要认证 |
| PUT | /api/projects/{slug} | 更新项目 | 需要认证 |
| DELETE | /api/projects/{slug} | 删除项目 | 需要认证 |

### 作品集 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/portfolio | 获取作品列表 | 公开 |
| GET | /api/portfolio/{id} | 获取作品详情 | 公开 |
| POST | /api/portfolio | 创建作品 | 管理员 |
| PUT | /api/portfolio/{id} | 更新作品 | 管理员 |
| DELETE | /api/portfolio/{id} | 删除作品 | 管理员 |

### 服务与询价 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/services | 获取服务列表 | 公开 |
| POST | /api/services/inquiries | 创建询价 | 公开 |
| GET | /api/services/inquiries | 获取询价列表 | 管理员 |
| PUT | /api/services/inquiries/{id} | 更新询价状态 | 管理员 |
| POST | /api/services/orders | 创建订单 | 需要认证 |
| GET | /api/services/orders | 获取我的订单 | 需要认证 |

### 用户管理 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/users | 获取用户列表 | 管理员 |
| GET | /api/users/{id} | 获取用户详情 | 管理员 |
| PUT | /api/users/{id} | 更新用户 | 管理员 |
| PUT | /api/users/{id}/role | 更新用户角色 | 管理员 |
| DELETE | /api/users/{id} | 删除用户 | 管理员 |
| GET | /api/users/stats/count | 用户统计 | 管理员 |

### 联系表单 API

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | /api/contact | 发送联系邮件 | 公开 |

### 健康检查 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /health | 基础健康检查 |
| GET | /health/detailed | 详细健康检查 |

## 测试

### 运行所有测试

```bash
cd backend
pytest tests/ -v --tb=short
```

### 运行特定测试类

```bash
pytest tests/test_api.py::TestAuth -v
```

### 运行特定测试

```bash
pytest tests/test_api.py::TestAuth::test_login_success -v
```

### 生成测试报告

```bash
pytest tests/ --html=test_report.html
```

## 日志

日志文件位于 `logs/` 目录：

- `app.log` - 应用运行日志 (按大小轮转, 10MB)
- `error.log` - 错误日志 (按天轮转, 保留30天)

## 部署

### 生产环境依赖

```bash
pip install gunicorn uvicorn[standard]
```

### 使用 Gunicorn 启动

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 使用 Systemd 部署

创建服务文件 `/etc/systemd/system/portfolio-backend.service`：

```ini
[Unit]
Description=Portfolio Backend API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/backend/venv/bin"
ExecStart=/path/to/backend/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs {
        proxy_pass http://localhost:8000/docs;
    }
}
```

## License

MIT
