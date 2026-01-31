# 个人能力展示网站 - 前端

Next.js 构建的现代化个人作品展示网站前端。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| UI 库 | React 18+ |
| 样式 | Tailwind CSS |
| 组件库 | shadcn/ui |
| 状态管理 | React Context |
| HTTP 客户端 | Axios |

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 目录结构

```
frontend/
├── app/
│   ├── (auth)/                 # 认证页面组
│   │   ├── login/
│   │   │   └── page.tsx        # 登录页
│   │   └── register/
│   │       └── page.tsx        # 注册页
│   ├── (main)/                 # 主要页面组
│   │   ├── about/
│   │   │   └── page.tsx        # 关于页
│   │   ├── blog/               # 博客
│   │   │   ├── page.tsx        # 博客列表
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # 新建文章
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 文章详情
│   │   ├── forum/              # 论坛
│   │   │   ├── page.tsx        # 话题列表
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # 新建话题
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 话题详情
│   │   ├── projects/           # 项目展示
│   │   │   └── page.tsx
│   │   ├── portfolio/          # 作品集
│   │   │   └── page.tsx
│   │   ├── services/           # 服务展示
│   │   │   └── page.tsx
│   │   ├── contact/            # 联系页
│   │   │   └── page.tsx
│   │   ├── pricing/            # 价格页
│   │   │   └── page.tsx
│   │   ├── layout.tsx          # 主布局
│   │   └── page.tsx            # 首页
│   ├── admin/                  # 管理后台
│   │   ├── dashboard/
│   │   │   └── page.tsx        # 仪表盘
│   │   ├── blog/               # 博客管理
│   │   ├── projects/           # 项目管理
│   │   ├── portfolio/          # 作品集管理
│   │   ├── services/           # 服务管理
│   │   ├── forum/              # 论坛管理
│   │   ├── users/              # 用户管理
│   │   └── inquiries/          # 询价管理
│   ├── api/                    # API 代理
│   │   └── [...]
│   ├── globals.css             # 全局样式
│   └── layout.tsx              # 根布局
├── components/
│   ├── ui/                     # 基础 UI 组件
│   ├── shared/                 # 共享组件
│   └── admin/                  # 管理后台组件
├── lib/
│   ├── api.ts                  # API 封装
│   ├── auth.ts                 # 认证工具
│   └── utils.ts                # 工具函数
├── hooks/                      # 自定义 Hooks
├── public/                     # 静态资源
├── tailwind.config.js
├── next.config.js
└── package.json
```

## 可用命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint |
| `npm run test` | 运行测试 |
| `npm run type-check` | 类型检查 |

## 主要功能

### 公开页面
- 首页 - 展示个人简介和核心能力
- 博客 - 技术文章展示和阅读
- 论坛 - 技术讨论社区
- 项目展示 - 个人项目作品展示
- 作品集 - 设计作品瀑布流展示
- 服务展示 - 提供服务说明
- 联系表单 - 邮件联系

### 管理后台
- 数据仪表盘
- 博客管理 (CRUD)
- 项目管理 (CRUD)
- 作品集管理 (CRUD)
- 服务管理 (CRUD)
- 论坛管理
- 用户管理
- 询价管理

## 主题风格

网站采用暗黑科技风设计，包含：
- 深色主题背景
- 霓虹发光效果
- 玻璃拟态卡片
- 渐变边框
- 科技网格背景
- 流畅动画过渡

## 样式配置

### Tailwind 扩展

在 `tailwind.config.js` 中配置了自定义主题：

```javascript
theme: {
  extend: {
    colors: {
      background: "...",
      primary: "...",
      accent: "...",
    },
    animation: {
      "glow": "glow 2s ease-in-out infinite alternate",
      "float": "float 6s ease-in-out infinite",
    },
  },
}
```

## 部署

### 1. 构建生产版本

```bash
npm run build
```

### 2. 启动生产服务器

```bash
npm run start
```

### 3. 使用 Docker 部署

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### 4. 使用 Vercel 部署 (推荐)

```bash
npm i -g vercel
vercel
```

## 开发规范

### 代码风格
- 使用 ESLint + Prettier
- 遵循 TypeScript 严格模式
- 使用函数式组件
- 组件名使用 PascalCase

### Git 提交规范

```
feat: 新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## License

MIT
