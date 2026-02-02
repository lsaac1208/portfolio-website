"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogApi } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Plus, FileText, ArrowRight } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogApi.list({ page: 1, limit: 100 });
        setPosts((data as any).posts || []);
      } catch (error) {
        console.error("获取文章失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">博客管理</h1>
          <p className="text-muted-foreground">管理您的技术文章</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : posts.length > 0 ? (
        <Card className="card-base">
          <div className="divide-y divide-border/50">
            {posts.map((post) => (
              <div key={post.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="icon-box-sm">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${post.published ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                    {post.published ? "已发布" : "草稿"}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/blog/${post.slug}/edit`}>编辑</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="card-base p-12 text-center">
          <div className="icon-box mx-auto mb-4 w-16 h-16">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">暂无文章</h3>
          <p className="text-muted-foreground mb-4">开始创建您的第一篇文章</p>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              新建文章
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
