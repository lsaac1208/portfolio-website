"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Github, ExternalLink, Calendar, User, Star, GitBranch, Clock } from "lucide-react";

// 模拟数据
const mockProject = {
  name: "个人作品集网站",
  slug: "portfolio-website",
  description: "一个现代化的个人作品集网站，支持博客、论坛、项目展示等功能",
  content: `
# 项目介绍

这是一个全栈个人作品集网站，展示了开发者的工作经验和技能。

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: FastAPI, Python, SQLAlchemy
- **数据库**: SQLite (可迁移到 PostgreSQL)
- **部署**: Nginx, Supervisor, Gunicorn

## 主要功能

1. 博客系统 - 发布和管理技术文章
2. 论坛 - 技术讨论和问答
3. 项目展示 - 展示开源项目
4. 作品集 - 瀑布流展示设计作品
5. 服务展示 - 展示提供的服务项目
6. 用户系统 - 注册、登录

## 项目亮点

- 现代化暗黑科技风设计
- 响应式布局，适配各种设备
- SEO 优化
- 高性能渲染
- 安全的用户认证
  `,
  tech_stack: ["Next.js", "FastAPI", "SQLite", "Tailwind CSS", "TypeScript"],
  github_url: "https://github.com",
  demo_url: "https://demo.example.com",
  featured: true,
  sort_order: 1,
  created_at: "2024-01-01",
  updated_at: "2024-01-15",
  author: { name: "Admin" },
  stars: 120,
  forks: 30,
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const project = mockProject;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回项目
        </Link>
      </Button>

      {/* 项目头部 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {project.name}
          </h1>
          {project.featured && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <Star className="h-3 w-3" />
              精选
            </span>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          {project.description}
        </p>
      </div>

      {/* 链接按钮 */}
      <div className="flex flex-wrap gap-4 mb-8">
        {project.github_url && (
          <Button asChild>
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              查看源码
            </a>
          </Button>
        )}
        {project.demo_url && (
          <Button variant="secondary" asChild>
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              在线演示
            </a>
          </Button>
        )}
      </div>

      {/* 技术栈 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* GitHub 统计 */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-semibold">{project.stars}</div>
                <div className="text-xs text-muted-foreground">Stars</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-semibold">{project.forks}</div>
                <div className="text-xs text-muted-foreground">Forks</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-semibold">{formatDate(project.created_at)}</div>
                <div className="text-xs text-muted-foreground">创建时间</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-semibold">{project.author.name}</div>
                <div className="text-xs text-muted-foreground">作者</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目详情 */}
      <Card className="glass-card">
        <CardContent className="p-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6">
              {project.content.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) {
                  return <h1 key={idx} className="text-2xl font-bold mt-8">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={idx} className="text-xl font-semibold mt-6">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={idx} className="text-lg font-medium mt-4">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={idx} className="ml-4">{line.slice(2)}</li>;
                }
                if (line.trim() === '') {
                  return <br key={idx} />;
                }
                return <p key={idx} className="text-muted-foreground">{line}</p>;
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
