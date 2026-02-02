# Portfolio Website 🌐

一个集博客、论坛、项目展示、作品集、服务展示和用户管理于一体的全栈个人网站。

## ✨ 功能特性

### 用户功能
- **用户认证** - 注册、登录、JWT 鉴权
- **博客系统** - 发布、编辑、删除技术文章
- **论坛** - 技术讨论、问答互动
- **项目展示** - 展示开源项目和个人作品
- **作品集** - 瀑布流展示设计作品
- **服务展示** - 展示提供的服务项目
- **询价系统** - 接收项目咨询

### Admin 管理后台
- **仪表盘** - 数据概览
- **用户管理** - 用户列表、角色管理
- **内容管理** - 博客、论坛、项目、作品集、服务的增删改查
- **咨询管理** - 查看和处理询价

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router), React 18, TypeScript |
| UI | shadcn/ui, Tailwind CSS, Lucide Icons |
| 后端 | FastAPI, Python 3.10+ |
| ORM | SQLAlchemy |
| 数据库 | SQLite (开发) / PostgreSQL (生产) |
| 认证 | JWT (Python-JOSE) |
| 部署 | Node.js Standalone, Gunicorn, Nginx |

## 📁 项目结构

```
portfolio-website/
├── frontend/                      # Next.js 前端
│   ├── app/
│   │   ├── (auth)/                # 认证页面
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/                # 主要页面
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   ├── forum/
│   │   │   ├── portfolio/
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   └── page.tsx           # 首页
│   │   ├── admin/                 # 管理后台
│   │   │   ├── dashboard/
│   │   │   ├── blog/
│   │   │   ├── forum/
│   │   │   ├── inquiries/
│   │   │   ├── portfolio/
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   └── users/
│   │   ├── api/                   # API 代理
│   │   ├── components/
│   │   │   ├── layout/            # 布局组件
│   │   │   └── ui/                # UI 组件
│   │   ├── lib/                   # 工具函数
│   │   └── globals.css
│   ├── public/
│   └── package.json
│
├── backend/                       # FastAPI 后端
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/            # API 路由
│   │   │   │   ├── auth.py
│   │   │   │   ├── blog.py
│   │   │   │   ├── contact.py
│   │   │   │   ├── forum.py
│   │   │   │   ├── portfolio.py
│   │   │   │   ├── projects.py
│   │   │   │   ├── services.py
│   │   │   │   └── users.py
│   │   │   ├── deps.py            # 依赖注入
│   │   │   └── routes.py
│   │   ├── core/                  # 核心配置
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/                # 数据模型
│   │   ├── schemas/               # Pydantic 模式
│   │   └── db/
│   ├── alembic/                   # 数据库迁移
│   ├── requirements.txt
│   └── main.py
│
├── deploy/                        # 部署文件
│   ├── .next/                     # Next.js 构建产物
│   ├── server.js                  # Standalone 服务器
│   └── package.json
│
├── nginx/                         # Nginx 配置
│   └── nginx.conf
│
├── docs/                          # 文档
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Python 3.10+
- npm / pip

### 1. 克隆项目

```bash
git clone https://github.com/lsaac1208/portfolio-website.git
cd portfolio-website
```

### 2. 前端启动

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 3. 后端启动

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

访问 http://localhost:8000/docs (Swagger API 文档)

## 🐳 Docker 部署

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## ☁️ 生产环境部署

### 方式一：Standalone + Nginx (推荐)

```bash
# 1. 构建前端
cd frontend
npm install
npm run build

# 2. 复制部署文件
cp -r deploy/.next deploy/package.json deploy/server.js /var/www/my-portfolio/
cd /var/www/my-portfolio
npm install --production

# 3. 配置后端
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. 配置 Nginx
sudo cp nginx/nginx.conf /etc/nginx/sites-available/my-portfolio
sudo ln -s /etc/nginx/sites-available/my-portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. 启动
node server.js
```

### 方式二：Docker

```bash
docker build -t portfolio .
docker run -p 80:80 portfolio
```

### SSL 证书

```bash
sudo certbot --nginx -d your-domain.com
```

## 📝 环境变量

### 后端 (.env)

```env
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite+aiosqlite:///./portfolio.db
```

### 前端 (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔐 默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| Admin | admin@d1bk.com | admin123456 |

## 🎨 设计风格

网站采用**暗黑科技风**设计：
- 🌙 深色主题背景
- ✨ 霓虹发光效果
- 🪟 玻璃拟态卡片
- 🔲 渐变边框
- 🌐 科技网格背景
- ⚡ 流畅动画过渡

## 📦 主要依赖

### 前端
- `next` 14.x
- `react` 18.x
- `typescript` 5.x
- `tailwindcss` 3.x
- `shadcn/ui`
- `lucide-react`

### 后端
- `fastapi` 0.109.x
- `uvicorn` 0.27.x
- `sqlalchemy` 2.x
- `pydantic` 2.x
- `python-jose` 3.x
- `passlib` 1.7.x

## 📄 License

MIT License - 欢迎 Fork 和贡献！

---

**作者**: lsaac1208
**GitHub**: https://github.com/lsaac1208/portfolio-website
