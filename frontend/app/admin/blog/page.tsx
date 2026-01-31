"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { blogApi, showError, showSuccess } from "@/lib/api-client";
import type { Post } from "@/lib/types";

export default function AdminBlogPage() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogApi.list();
      // blogApi.list 返回 PostListResponse，需要提取 posts 数组
      setPosts(data.posts || []);
    } catch (error) {
      showError("获取文章列表失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number, slug: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;

    setDeleting(id);
    try {
      await blogApi.delete(slug);
      setPosts(posts.filter((p) => p.id !== id));
      showSuccess("文章已删除");
    } catch (error) {
      showError("删除失败");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">文章管理</h1>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">文章管理</h1>
          <p className="text-muted-foreground mt-1">管理您的博客文章</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Link>
        </Button>
      </div>

      {/* 搜索 */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索文章..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 input-glow"
          />
        </div>
      </div>

      {/* 文章列表 */}
      <Card className="gradient-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${post.slug}`} className="font-medium hover:text-primary transition-colors truncate">
                      {post.title}
                    </Link>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "已发布" : "草稿"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">{post.excerpt || ""}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/blog/${post.slug}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id, post.slug)}
                    disabled={deleting === post.id}
                  >
                    {deleting === post.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          没有找到相关文章
        </div>
      )}
    </div>
  );
}
