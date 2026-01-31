"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Github, ExternalLink, Plus, Trash2 } from "lucide-react";
import { projectApi, showError, showSuccess } from "@/lib/api-client";
import type { ProjectCreate } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    content: "",
    cover_image: "",
    github_url: "",
    demo_url: "",
    tech_stack: [""],
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tech_stack = formData.tech_stack.filter((t: string) => t.trim());
      const data: ProjectCreate = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        cover_image: formData.cover_image,
        github_url: formData.github_url || undefined,
        demo_url: formData.demo_url || undefined,
        tech_stack,
        featured: formData.featured,
      };
      await projectApi.create(data);
      showSuccess("项目创建成功");
      router.push("/admin/projects");
    } catch (err) {
      const message = err instanceof Error ? err.message : "创建失败";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSlugify = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  const addTech = () => {
    setFormData({ ...formData, tech_stack: [...formData.tech_stack, ""] });
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((_, i) => i !== index),
    });
  };

  const updateTech = (index: number, value: string) => {
    const newTech = [...formData.tech_stack];
    newTech[index] = value;
    setFormData({ ...formData, tech_stack: newTech });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回项目管理
        </Link>
      </Button>

      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>添加新项目</CardTitle>
          <CardDescription>添加新的项目展示</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  项目名称
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <label htmlFor="description" className="text-sm font-medium">
                简短描述
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">技术栈</label>
              <div className="space-y-2">
                {formData.tech_stack.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tech}
                      onChange={(e) => updateTech(index, e.target.value)}
                      placeholder="React, Node.js, Python..."
                      className="input-glow flex-1"
                    />
                    {formData.tech_stack.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTech(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTech}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加技术
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="github_url" className="text-sm font-medium">
                  <Github className="inline h-4 w-4 mr-1" />
                  GitHub 链接
                </label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="input-glow"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="demo_url" className="text-sm font-medium">
                  <ExternalLink className="inline h-4 w-4 mr-1" />
                  演示链接
                </label>
                <Input
                  id="demo_url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  placeholder="https://..."
                  className="input-glow"
                />
              </div>
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

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                详细介绍
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[200px] input-glow"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                设为精选项目
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/projects">取消</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "保存中..." : "保存项目"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
