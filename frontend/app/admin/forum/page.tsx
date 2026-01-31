"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Search, Eye, MessageSquare, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { forumApi, showError, showSuccess } from "@/lib/api-client";
import type { Topic } from "@/lib/types";

export default function AdminForumPage() {
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const data = await forumApi.adminListTopics();
      setTopics(data);
    } catch (error) {
      showError("获取话题列表失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个话题吗？")) return;

    setProcessing(id);
    try {
      await forumApi.adminDeleteTopic(id);
      setTopics(topics.filter(t => t.id !== id));
      showSuccess("话题已删除");
    } catch (err) {
      const message = err instanceof Error ? err.message : "删除失败";
      showError(message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">论坛管理</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">论坛管理</h1>
        <p className="text-muted-foreground mt-1">管理论坛话题和评论（{topics.length} 个话题）</p>
      </div>

      {/* 搜索 */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索话题..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 input-glow"
          />
        </div>
      </div>

      {/* 话题列表 */}
      <Card className="gradient-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/forum/${topic.id}`} className="font-medium hover:text-primary transition-colors truncate">
                      {topic.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>作者ID: {topic.author_id}</span>
                    <span>{formatDate(topic.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {topic.views}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(topic.id)}
                    disabled={processing === topic.id}
                    title="删除话题"
                  >
                    {processing === topic.id ? (
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

      {filteredTopics.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          没有找到相关话题
        </div>
      )}
    </div>
  );
}
