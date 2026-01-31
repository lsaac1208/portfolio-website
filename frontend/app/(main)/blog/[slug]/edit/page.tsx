"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

// 模拟数据
const mockPost = {
  title: "Next.js 14 最佳实践",
  slug: "nextjs-14-best-practices",
  content: "# Next.js 14 新特性\n\n这是文章内容...",
  excerpt: "探索 Next.js 14 的新特性",
  cover_image: "",
  published: true,
};

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(mockPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/blog");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回博客
        </Link>
      </Button>

      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>编辑文章</CardTitle>
          <CardDescription>修改文章内容</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                标题
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                URL Slug
              </label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                摘要
              </label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                内容 (Markdown)
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="min-h-[300px] input-glow font-mono"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cover_image" className="text-sm font-medium">
                封面图片 URL
              </label>
              <Input
                id="cover_image"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="input-glow"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="published" className="text-sm font-medium">
                已发布
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/blog">取消</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "保存中..." : "保存修改"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
