# MyPortfolio - 个人能力展示网站

集博客、论坛、项目展示、作品集展示于一体的综合性个人网站。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router), React, TypeScript |
| UI | shadcn/ui, Tailwind CSS |
| 后端 | FastAPI, Python |
| ORM | SQLAlchemy |
| 数据库 | SQLite (可迁移到 PostgreSQL) |
| 认证 | JWT |
| 部署 | Nginx, Supervisor, Gunicorn |

## 项目结构

```
my-portfolio/
├── frontend/                     # Next.js 前端
│   ├── app/                      # App Router
│   │   ├── (auth)/               # 认证页面
│   │   ├── (main)/               # 主要页面
│   │   ├── api/                  # API 代理
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # 组件
│   ├── lib/                      # 工具函数
│   └── ...
├── backend/                      # FastAPI 后端
│   ├── app/
│   │   ├── api/routes/           # API 路由
│   │   ├── core/                 # 核心配置
│   │   ├── models/               # 数据模型
│   │   ├── schemas/              # Pydantic 模式
│   │   └── db/                   # 数据库
│   ├── alembic/                  # 数据库迁移
│   └── scripts/                  # 启动脚本
├── nginx/                        # Nginx 配置
├── supervisor/                   # Supervisor 配置
└── README.md
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 后端

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

访问 http://localhost:8000/docs (Swagger UI)

## 部署

### 1. 安装依赖

```bash
# 前端
cd frontend
npm install
npm run build

# 后端
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件
```

### 3. 配置 Nginx

```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/my-portfolio
sudo ln -s /etc/nginx/sites-available/my-portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 配置 Supervisor

```bash
sudo cp supervisor/portfolio-backend.conf /etc/supervisor/conf.d/
sudo cp supervisor/portfolio-frontend.conf /etc/supervisor/conf.d/
sudo supervisorctl update
sudo supervisorctl start portfolio-backend
sudo supervisorctl start portfolio-frontend
```

### 5. SSL 证书 (生产环境)

```bash
sudo certbot --nginx -d your-domain.com
```

## 功能模块

- **博客系统** - 发布和管理技术文章
- **论坛** - 技术讨论和问答
- **项目展示** - 展示开源项目和个人作品
- **作品集** - 瀑布流展示设计作品
- **服务展示** - 展示提供的服务项目
- **询价系统** - 接收项目咨询
- **用户系统** - 注册、登录、个人中心

## 暗黑科技风主题

网站采用暗黑科技风设计，包含：
- 霓虹发光效果
- 玻璃拟态
- 渐变边框
- 科技网格背景
- 流畅动画

## License

MIT
