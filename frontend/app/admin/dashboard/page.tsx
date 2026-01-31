"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  FolderKanban,
  MessageSquare,
  Users,
  ShoppingCart,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { blogApi, projectApi, forumApi, inquiryApi, showError } from "@/lib/api-client";
import type { Post, Project, Topic, Inquiry } from "@/lib/types";

interface Stats {
  name: string;
  value: string;
  change: string;
  icon: typeof FileText;
  color: string;
}

interface Activity {
  id: number;
  type: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 并行获取数据，只请求需要的数量
      const [posts, projects, topics, inquiries] = await Promise.all([
        blogApi.list({ page: 1, limit: 5 }),
        projectApi.list({ featured: undefined }),
        forumApi.listTopics({ page: 1, limit: 5 }),
        inquiryApi.list(),
      ]);

      // 提取 posts 数组（blogApi.list 返回 PostListResponse）
      const postsList = posts.posts || posts;
      const topicsList = topics.topics || topics;

      // 计算统计数据
      setStats([
        { name: "文章总数", value: String(postsList.length || 0), change: "+0", icon: FileText, color: "text-blue-500" },
        { name: "项目数量", value: String(projects.length || 0), change: "+0", icon: FolderKanban, color: "text-green-500" },
        { name: "论坛帖子", value: String(topicsList.length || 0), change: "+0", icon: MessageSquare, color: "text-purple-500" },
        { name: "询价数量", value: String(inquiries.length || 0), change: "+0", icon: ShoppingCart, color: "text-cyan-500" },
      ]);

      // 生成最近活动（从真实数据中提取）
      const activities: Activity[] = [
        ...postsList.slice(0, 2).map((p: Post, i: number) => ({
          id: i,
          type: "post",
          user: "Admin",
          action: "发布了新文章",
          target: p.title,
          time: formatDate(p.created_at),
        })),
        ...projects.slice(0, 2).map((p: Project, i: number) => ({
          id: 10 + i,
          type: "project",
          user: "Admin",
          action: "添加了新项目",
          target: p.name,
          time: formatDate(p.created_at),
        })),
        ...inquiries.slice(0, 2).map((i: Inquiry, idx: number) => ({
          id: 20 + idx,
          type: "inquiry",
          user: i.client_name,
          action: "提交了询价",
          target: i.project_type || "咨询服务",
          time: formatDate(i.created_at),
        })),
      ];

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("获取仪表盘数据失败:", error);
      showError("获取仪表盘数据失败");
      // 使用默认统计
      setStats([
        { name: "文章总数", value: "0", change: "+0", icon: FileText, color: "text-blue-500" },
        { name: "项目数量", value: "0", change: "+0", icon: FolderKanban, color: "text-green-500" },
        { name: "论坛帖子", value: "0", change: "+0", icon: MessageSquare, color: "text-purple-500" },
        { name: "询价数量", value: "0", change: "+0", icon: ShoppingCart, color: "text-cyan-500" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
          <p className="text-muted-foreground mt-1">加载中...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground mt-1">欢迎回来，这是网站的整体概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="gradient-border card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-primary/10 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span className="text-muted-foreground">较上周</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 最近活动 */}
        <Card className="gradient-border">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>网站最新的动态</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {activity.type === "post" && <FileText className="h-5 w-5 text-blue-500" />}
                      {activity.type === "project" && <FolderKanban className="h-5 w-5 text-green-500" />}
                      {activity.type === "comment" && <MessageSquare className="h-5 w-5 text-purple-500" />}
                      {activity.type === "inquiry" && <ShoppingCart className="h-5 w-5 text-cyan-500" />}
                      {activity.type === "user" && <Users className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {" "}{activity.action}
                      </p>
                      <p className="text-sm text-primary truncate">{activity.target}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无活动数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* 快捷操作 */}
        <Card className="gradient-border">
          <CardHeader>
            <CardTitle>快捷操作</CardTitle>
            <CardDescription>常用功能的快速入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="/admin/blog/new"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">撰写文章</p>
                  <p className="text-sm text-muted-foreground">发布新博客文章</p>
                </div>
              </a>
              <a
                href="/admin/projects/new"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20">
                  <FolderKanban className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">添加项目</p>
                  <p className="text-sm text-muted-foreground">展示新作品</p>
                </div>
              </a>
              <a
                href="/admin/inquiries"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20">
                  <ShoppingCart className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="font-medium">处理询价</p>
                  <p className="text-sm text-muted-foreground">查看待处理请求</p>
                </div>
              </a>
              <a
                href="/admin/users"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">用户管理</p>
                  <p className="text-sm text-muted-foreground">管理注册用户</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
