"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { blogApi, showError } from "@/lib/api-client";
import type { Post } from "@/lib/types";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogApi.get(slug);
        setPost(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "加载失败";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // HTML转义函数
  const escapeHtml = (text: string): string => {
    return DOMPurify.sanitize(text);
  };

  // 简单的Markdown渲染（带XSS防护）
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const safeLine = escapeHtml(line);
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-bold mt-8">{safeLine.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-semibold mt-6">{safeLine.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-medium mt-4">{safeLine.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4">{safeLine.slice(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={idx} className="ml-4 list-decimal">{safeLine.replace(/^\d+\. /, '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className="text-muted-foreground">{safeLine}</p>;
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回博客
          </Link>
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error || "文章不存在"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回博客
        </Link>
      </Button>

      <article>
        {/* 头部 */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author?.name || "Admin"}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {escapeHtml(post.title)}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground">
              {escapeHtml(post.excerpt)}
            </p>
          )}
        </header>

        {/* 封面图 */}
        {post.cover_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.cover_image}
              alt={escapeHtml(post.title)}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* 内容 */}
        <Card className="p-8 glass-card">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6">
              {renderContent(post.content)}
            </div>
          </div>
        </Card>
      </article>
    </div>
  );
}
