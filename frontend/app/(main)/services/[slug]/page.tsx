"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Check, Clock, Calendar, ChevronRight } from "lucide-react";

// 模拟数据
const mockService = {
  name: "Web 应用开发",
  slug: "web-development",
  description: "现代化响应式网站和 Web 应用开发",
  content: `
# Web 应用开发服务

我提供专业的 Web 应用开发服务，帮助您构建现代化、高性能的网络应用。

## 服务内容

### 前端开发
- 使用 Next.js、React 构建现代化界面
- 响应式设计，适配各种设备
- 动画效果和交互优化
- 性能优化和 SEO 优化

### 后端开发
- RESTful API 设计和实现
- 数据库设计和优化
- 用户认证和授权
- 接口安全和性能优化

### 部署上线
- 服务器配置和部署
- CI/CD 流程搭建
- 监控和日志系统
- 后期维护支持

## 开发流程

1. **需求分析** - 详细了解项目需求
2. **方案设计** - 提供技术方案和报价
3. **开发实现** - 敏捷开发，定期交付
4. **测试验收** - 全面测试，确保质量
5. **部署上线** - 协助部署，提供文档

## 为什么选择我？

- 多年全栈开发经验
- 注重代码质量和性能
- 及时沟通和反馈
- 提供后期维护支持
  `,
  price_type: "fixed",
  price_from: 5000,
  price_to: 50000,
  icon: "Globe",
  features: [
    "响应式网站设计",
    "后台管理系统",
    "用户注册登录",
    "SEO 优化",
    "在线支付集成",
    "高级SEO优化",
    "6 个月技术支持",
  ],
  estimated_days: 14,
  active: true,
  created_at: "2024-01-01",
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const service = mockService;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回服务
        </Link>
      </Button>

      {/* 服务头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {service.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {service.description}
        </p>
      </div>

      {/* 价格信息 */}
      <Card className="mb-8 gradient-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">服务价格</div>
              <div className="text-3xl font-bold text-primary">
                {service.price_type === "hourly"
                  ? `¥${service.price_from}/小时`
                  : service.price_type === "custom"
                  ? "定制报价"
                  : `¥${service.price_from.toLocaleString()} - ¥${service.price_to?.toLocaleString()}`}
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>预计 {service.estimated_days} 天完成</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 功能列表 */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>服务包含</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>服务流程</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { step: 1, title: "需求分析", desc: "详细了解项目需求" },
                { step: 2, title: "方案设计", desc: "提供技术方案和报价" },
                { step: 3, title: "开发实现", desc: "敏捷开发，定期交付" },
                { step: 4, title: "测试验收", desc: "全面测试，确保质量" },
                { step: 5, title: "部署上线", desc: "协助部署，提供文档" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细介绍 */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6">
              {service.content.split('\n').map((line, idx) => {
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

      {/* CTA */}
      <Card className="gradient-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">准备好开始了吗？</h3>
              <p className="text-muted-foreground">联系我，获取详细报价和方案</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/pricing">查看定价</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">立即咨询</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
