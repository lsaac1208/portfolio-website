import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowRight, FileText, Calendar, Clock } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getPosts() {
  try {
    const res = await fetch(`${API_BASE}/api/blog/posts?page=1&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="page-container">
      <section className="page-section">
        <div className="max-w-6xl mx-auto px-6">
          {/* 标题 */}
          <div className="text-center mb-16">
            <h1 className="page-title mb-4">技术博客</h1>
            <p className="page-subtitle">分享技术文章、经验总结和思考感悟</p>
          </div>

          {/* 文章列表 */}
          {posts.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {posts.map((post: any, index: number) => (
                <article
                  key={post.id}
                  className="bento-item p-6 group animate-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-5">
                    <div className="icon-wrap-sm flex-shrink-0 mt-1">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.created_at)}
                        </span>
                        {post.read_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.read_time} 分钟
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt || ""}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all"
                      >
                        阅读全文 <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="empty-title">暂无文章</h3>
              <p className="empty-desc">敬请期待更多技术内容</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
