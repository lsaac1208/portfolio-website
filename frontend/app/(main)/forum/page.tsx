import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Eye, User } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Topic {
  id: number;
  title: string;
  content: string;
  author_id: number;
  views: number;
  created_at: string;
}

async function getTopics(): Promise<Topic[]> {
  try {
    const res = await fetch(`${API_BASE}/api/forum/topics?page=1&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.topics || [];
  } catch {
    return [];
  }
}

export default async function ForumPage() {
  const topics = await getTopics();

  if (!topics.length) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              技术论坛
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              技术讨论、问题解答、社区互动
            </p>
          </div>
          <Button asChild>
            <Link href="/forum/new">发布话题</Link>
          </Button>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          暂无话题
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            技术论坛
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            技术讨论、问题解答、社区互动
          </p>
        </div>
        <Button asChild>
          <Link href="/forum/new">发布话题</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {topics.map((topic: Topic) => (
          <Card key={topic.id} className="gradient-border card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/forum/${topic.id}`}
                    className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
                  >
                    {topic.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {topic.content}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      用户 {topic.author_id}
                    </span>
                    <span>{formatDate(topic.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {topic.views}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
