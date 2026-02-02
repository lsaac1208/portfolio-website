"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { blogApi, projectApi, forumApi, inquiryApi } from "@/lib/api-client";
import { FileText, Briefcase, MessageSquare, Zap, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Stats {
  name: string;
  value: string;
  icon: typeof FileText;
  href: string;
  description: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posts, projects, topics, inquiries] = await Promise.allSettled([
          blogApi.list({ page: 1, limit: 1 }),
          projectApi.list(),
          forumApi.listTopics({ page: 1, limit: 1 }),
          inquiryApi.list(),
        ]);

        const postsCount = posts.status === "fulfilled" ? (posts.value as any).total || 0 : 0;
        const projectsCount = projects.status === "fulfilled" ? (projects.value as any).length || 0 : 0;
        const topicsCount = topics.status === "fulfilled" ? (topics.value as any).topics?.length || 0 : 0;
        const inquiriesCount = inquiries.status === "fulfilled" ? (inquiries.value as any).length || 0 : 0;

        setStats([
          { name: "博客文章", value: String(postsCount), icon: FileText, href: "/admin/blog", description: "已发布的文章" },
          { name: "项目", value: String(projectsCount), icon: Briefcase, href: "/admin/projects", description: "展示的项目" },
          { name: "论坛帖子", value: String(topicsCount), icon: MessageSquare, href: "/admin/forum", description: "讨论话题" },
          { name: "询价", value: String(inquiriesCount), icon: Zap, href: "/admin/inquiries", description: "客户询价" },
        ]);
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">仪表盘</h1>
        <p className="text-muted-foreground">网站整体概览</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="bento-item p-6 h-full hover:border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div className="icon-wrap-md">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
