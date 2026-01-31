# API 接口文档

本文档详细描述了个人能力展示网站的所有 API 接口。

## 基础信息

| 项目 | 值 |
|------|-----|
| 基础路径 | `/api` |
| 文档地址 | `/docs` (Swagger UI) |
| API 版本 | v1 |

## 认证方式

除公开接口外，所有 API 需要在请求头中携带 Token：

```
Authorization: Bearer <access_token>
```

Token 通过登录接口获取，有效期 30 分钟。

---

## 认证接口 (Auth)

### 注册用户

**POST** `/api/auth/register`

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 (唯一) |
| password | string | 是 | 密码 (至少8位, 含大小写数字特殊字符) |
| name | string | 是 | 用户名 (2-50字符) |

**请求示例：**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "用户名"
}
```

**响应示例 (200)：**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "用户名",
  "role": "USER",
  "created_at": "2024-01-15T10:30:00"
}
```

**错误响应 (400)：**

```json
{
  "detail": "该邮箱已被注册"
}
```

---

### 用户登录

**POST** `/api/auth/login`

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| email | string | 是 | 注册邮箱 |
| password | string | 是 | 密码 |

**请求示例：**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**响应示例 (200)：**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**错误响应 (401)：**

```json
{
  "detail": "邮箱或密码错误"
}
```

**错误响应 (403)：**

```json
{
  "detail": "账户已锁定，请 15 分钟后再试"
}
```

---

### 刷新 Token

**POST** `/api/auth/refresh`

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| refresh_token | string | 是 | 刷新令牌 |

**响应示例 (200)：**

```json
{
  "access_token": "new_access_token_here",
  "token_type": "bearer"
}
```

---

### 获取当前用户

**GET** `/api/auth/me`

**需要认证**

**响应示例 (200)：**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "用户名",
  "role": "USER",
  "created_at": "2024-01-15T10:30:00"
}
```

---

## 博客接口 (Blog)

### 获取文章列表

**GET** `/api/blog/posts`

**查询参数：**

| 参数 | 类型 | 描述 |
|------|------|------|
| page | int | 页码, 默认 1 |
| limit | int | 每页数量, 默认 10 |

**响应示例 (200)：**

```json
{
  "posts": [
    {
      "id": 1,
      "title": "文章标题",
      "slug": "article-slug",
      "excerpt": "文章摘要",
      "content": "...",
      "published": true,
      "author_id": 1,
      "created_at": "2024-01-15T10:30:00",
      "updated_at": "2024-01-15T10:30:00"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

---

### 获取文章详情

**GET** `/api/blog/posts/{slug}`

**响应示例 (200)：**

```json
{
  "id": 1,
  "title": "文章标题",
  "slug": "article-slug",
  "content": "文章完整内容...",
  "excerpt": "文章摘要",
  "published": true,
  "cover_image": "https://example.com/image.jpg",
  "author_id": 1,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

### 创建文章

**POST** `/api/blog/posts`

**需要认证**

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | 是 | 标题 |
| slug | string | 是 | URL 友好标识 |
| content | string | 是 | 内容 (Markdown) |
| excerpt | string | 否 | 摘要 |
| published | boolean | 否 | 是否发布, 默认 false |
| cover_image | string | 否 | 封面图 URL |

**响应示例 (200)：**

```json
{
  "id": 1,
  "title": "文章标题",
  "slug": "article-slug",
  "content": "...",
  "published": false,
  "created_at": "2024-01-15T10:30:00"
}
```

---

### 更新文章

**PUT** `/api/blog/posts/{slug}`

**需要认证**

请求体同上

---

### 删除文章

**DELETE** `/api/blog/posts/{slug}`

**需要认证**

**响应示例 (200)：**

```json
{
  "message": "删除成功"
}
```

---

## 论坛接口 (Forum)

### 获取话题列表

**GET** `/api/forum/topics`

**响应示例：**

```json
{
  "topics": [
    {
      "id": 1,
      "title": "话题标题",
      "content": "话题内容...",
      "author_id": 1,
      "author_name": "用户名",
      "replies_count": 5,
      "created_at": "2024-01-15T10:30:00",
      "updated_at": "2024-01-15T10:30:00"
    }
  ],
  "total": 30,
  "page": 1
}
```

---

### 获取话题详情

**GET** `/api/forum/topics/{id}`

**响应示例：**

```json
{
  "id": 1,
  "title": "话题标题",
  "content": "话题内容...",
  "author_id": 1,
  "author_name": "用户名",
  "replies": [
    {
      "id": 1,
      "content": "回复内容",
      "author_id": 2,
      "created_at": "2024-01-15T11:00:00"
    }
  ],
  "created_at": "2024-01-15T10:30:00"
}
```

---

### 创建话题

**POST** `/api/forum/topics`

**需要认证**

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | 是 | 标题 (3-200字符) |
| content | string | 是 | 内容 |

---

## 项目展示接口 (Projects)

### 获取项目列表

**GET** `/api/projects`

**响应示例：**

```json
[
  {
    "id": 1,
    "name": "项目名称",
    "slug": "project-slug",
    "description": "项目描述",
    "tech_stack": ["Python", "FastAPI", "React"],
    "github_url": "https://github.com/...",
    "demo_url": "https://demo.example.com",
    "cover_image": "https://example.com/cover.jpg",
    "featured": true,
    "created_at": "2024-01-15T10:30:00"
  }
]
```

---

### 获取项目详情

**GET** `/api/projects/{slug}`

---

### 创建项目

**POST** `/api/projects`

**需要认证**

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | string | 是 | 项目名称 |
| slug | string | 是 | URL 标识 |
| description | string | 是 | 描述 |
| tech_stack | array | 是 | 技术栈列表 |
| github_url | string | 否 | GitHub 链接 |
| demo_url | string | 否 | 演示链接 |
| cover_image | string | 否 | 封面图 URL |
| featured | boolean | 否 | 是否推荐 |

---

## 作品集接口 (Portfolio)

### 获取作品列表

**GET** `/api/portfolio`

**查询参数：**

| 参数 | 类型 | 描述 |
|------|------|------|
| category | string | 分类筛选 |

**分类值：** `design`, `photography`, `illustration`, `ui-ux`, `3d`, `video`, `other`

**响应示例：**

```json
[
  {
    "id": 1,
    "title": "作品标题",
    "description": "作品描述",
    "image_url": "https://example.com/image.jpg",
    "category": "design",
    "sort_order": 1,
    "created_at": "2024-01-15T10:30:00"
  }
]
```

---

### 获取作品详情

**GET** `/api/portfolio/{id}`

---

### 创建作品

**POST** `/api/portfolio`

**需要管理员权限**

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | 是 | 标题 |
| description | string | 是 | 描述 |
| image_url | string | 是 | 图片 URL |
| category | string | 是 | 分类 |
| sort_order | int | 否 | 排序 |

---

## 服务与询价接口 (Services)

### 获取服务列表

**GET** `/api/services`

**响应示例：**

```json
[
  {
    "id": 1,
    "name": "网站开发",
    "slug": "web-development",
    "description": "专业网站开发服务",
    "price": "¥5000起",
    "features": ["响应式设计", "SEO优化", "后台管理"],
    "sort_order": 1
  }
]
```

---

### 创建询价

**POST** `/api/services/inquiries`

**公开接口**

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| client_name | string | 是 | 客户姓名 |
| client_email | string | 是 | 联系邮箱 |
| project_type | string | 是 | 项目类型 |
| description | string | 是 | 项目描述 |
| budget | string | 否 | 预算范围 |
| timeline | string | 否 | 期望时间 |

**响应示例 (200)：**

```json
{
  "id": 1,
  "client_name": "客户姓名",
  "client_email": "client@example.com",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00"
}
```

---

### 获取询价列表

**GET** `/api/services/inquiries`

**需要管理员权限**

---

### 更新询价状态

**PUT** `/api/services/inquiries/{id}`

**需要管理员权限**

**请求体：**

| 字段 | 类型 | 描述 |
|------|------|------|
| status | string | 状态: contacted, in_progress, completed, cancelled |
| notes | string | 备注 |

---

### 创建订单

**POST** `/api/services/orders`

**需要认证**

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| service_slug | string | 是 | 服务标识 |
| notes | string | 否 | 备注 |

---

### 获取我的订单

**GET** `/api/services/orders`

**需要认证**

---

## 用户管理接口 (Users)

### 获取用户列表

**GET** `/api/users`

**需要管理员权限**

**响应示例：**

```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "name": "管理员",
    "role": "ADMIN",
    "created_at": "2024-01-15T10:30:00"
  }
]
```

---

### 获取用户详情

**GET** `/api/users/{id}`

**需要管理员权限**

---

### 更新用户

**PUT** `/api/users/{id}`

**需要管理员权限**

**请求体：**

| 字段 | 类型 | 描述 |
|------|------|------|
| name | string | 用户名 |
| email | string | 邮箱 |
| role | string | 角色: USER, ADMIN |

---

### 更新用户角色

**PUT** `/api/users/{id}/role`

**需要管理员权限**

**查询参数：**

| 参数 | 类型 | 描述 |
|------|------|------|
| role | string | USER 或 ADMIN |

---

### 删除用户

**DELETE** `/api/users/{id}`

**需要管理员权限**

---

### 获取用户统计

**GET** `/api/users/stats/count`

**需要管理员权限**

**响应示例：**

```json
{
  "total": 100,
  "admins": 3,
  "regular_users": 97
}
```

---

## 联系表单接口 (Contact)

### 发送联系邮件

**POST** `/api/contact`

**限制：** 每分钟最多 3 次

**请求体：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | string | 是 | 姓名 (2-100字符) |
| email | string | 是 | 邮箱 |
| subject | string | 是 | 主题 (3-200字符) |
| message | string | 是 | 内容 (10-5000字符) |

**响应示例 (200)：**

```json
{
  "message": "邮件发送成功"
}
```

---

## 健康检查接口

### 基础健康检查

**GET** `/health`

**响应示例：**

```json
{
  "status": "healthy"
}
```

---

### 详细健康检查

**GET** `/health/detailed`

**响应示例：**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或 Token 无效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

---

## 速率限制

| 接口类别 | 限制 |
|----------|------|
| 注册 | 5 次/分钟 |
| 登录 | 10 次/分钟 |
| 联系表单 | 3 次/分钟 |
| 其他接口 | 200 次/天, 50 次/小时 |

---

## 常见问题

### Q: Token 过期怎么办？

A: 使用 `/api/auth/refresh` 接口，通过 refresh_token 获取新的 access_token。

### Q: 账户被锁定怎么办？

A: 登录失败 5 次后账户会被锁定 15 分钟，等待自动解锁或联系管理员。

### Q: 如何获取管理员权限？

A: 初始创建的第一个用户为管理员，后续管理员可在数据库中手动设置用户 role 为 ADMIN。
