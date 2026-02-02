"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { forumApi } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminForumPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await forumApi.adminListTopics();
        setTopics(data as any[]);
      } catch (error) {
        console.error("获取帖子失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">论坛管理</h1>
        <p className="text-muted-foreground">管理论坛帖子</p>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : topics.length > 0 ? (
        <Card className="card-base">
          <div className="divide-y divide-border/50">
            {topics.map((topic) => (
              <div key={topic.id} className="p-4 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="icon-box">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{topic.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {topic.author_id || "未知"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {topic.views || 0}
                      </span>
                      <span>{formatDate(topic.created_at)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">查看详情</Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="card-base p-12 text-center">
          <div className="icon-box mx-auto mb-4 w-16 h-16">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">暂无帖子</h3>
        </Card>
      )}
    </div>
  );
}
