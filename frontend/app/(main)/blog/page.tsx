import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

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

  if (!posts.length) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            技术博客
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            分享技术文章、经验总结和思考感悟
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          暂无文章
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          技术博客
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          分享技术文章、经验总结和思考感悟
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <Card key={post.id} className="gradient-border card-hover">
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2">
                {formatDate(post.created_at)}
              </div>
              <CardTitle className="line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" asChild>
                <Link href={`/blog/${post.slug}`}>
                  阅读更多
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
