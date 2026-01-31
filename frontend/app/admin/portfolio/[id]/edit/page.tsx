"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Image, Link as LinkIcon, Loader2 } from "lucide-react";
import { portfolioApi, showError, showSuccess } from "@/lib/api-client";
import type { Portfolio } from "@/lib/types";

const categories = [
  { value: "design", label: "UI设计" },
  { value: "photography", label: "摄影" },
  { value: "illustration", label: "插画" },
];

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "design",
    description: "",
    image_url: "",
    link_url: "",
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await portfolioApi.get(parseInt(id));
        setFormData({
          title: data.title || "",
          category: data.category || "design",
          description: data.description || "",
          image_url: data.image_url || "",
          link_url: data.link_url || "",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "获取作品失败";
        showError(message);
      } finally {
        setFetching(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await portfolioApi.update(parseInt(id), formData);
      showSuccess("作品更新成功");
      router.push("/admin/portfolio");
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存失败";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/portfolio">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回作品集管理
        </Link>
      </Button>

      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>编辑作品</CardTitle>
          <CardDescription>修改作品信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                作品标题
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
              <label htmlFor="category" className="text-sm font-medium">
                分类
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                描述
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image_url" className="text-sm font-medium">
                <Image className="inline h-4 w-4 mr-1" />
                图片 URL
              </label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="link_url" className="text-sm font-medium">
                <LinkIcon className="inline h-4 w-4 mr-1" />
                作品链接 (可选)
              </label>
              <Input
                id="link_url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="input-glow"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/portfolio">取消</Link>
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
