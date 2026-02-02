import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getTopics() {
  try {
    const res = await fetch(`${API_BASE}/api/forum/topics?page=1&limit=20`, { cache: "no-store" });
    if (!res.ok) return { topics: [] };
    return await res.json();
  } catch { return { topics: [] }; }
}

export default async function ForumPage() {
  const { topics } = await getTopics();

  return (
    <div className="page-container">
      <section className="page-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="page-title">技术论坛</h1>
            <p className="page-description">技术讨论、问题解答、社区互动</p>
          </div>
          {topics && topics.length > 0 ? (
            <div className="space-y-4">
              {topics.map((topic: any) => (
                <Card key={topic.id} className="card-hover p-6">
                  <div className="flex items-start gap-4">
                    <div className="icon-box"><MessageSquare className="h-6 w-6 text-primary" /></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        <Link href={`/forum/${topic.id}`} className="hover:text-primary">{topic.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(topic.created_at)} · {topic.views || 0} 次浏览
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="icon-box mx-auto mb-4 w-16 h-16"><MessageSquare className="h-8 w-8 text-primary" /></div>
              <h3 className="text-lg font-medium">暂无帖子</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
