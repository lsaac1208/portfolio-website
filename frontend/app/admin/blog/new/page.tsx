"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { blogApi, showError, showSuccess } from "@/lib/api-client";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image: "",
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await blogApi.create(formData);
      showSuccess("文章创建成功");
      router.push("/admin/blog");
    } catch (err) {
      const message = err instanceof Error ? err.message : "创建失败";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSlugify = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回文章管理
        </Link>
      </Button>

      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>新建文章</CardTitle>
          <CardDescription>创建新的博客文章</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
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
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="input-glow flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleSlugify}>
                    生成
                  </Button>
                </div>
              </div>
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
              <label htmlFor="cover_image" className="text-sm font-medium">
                封面图片
              </label>
              <Input
                id="cover_image"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                内容
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="min-h-[300px] input-glow"
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
                直接发布
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/blog">取消</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "保存中..." : "保存文章"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
