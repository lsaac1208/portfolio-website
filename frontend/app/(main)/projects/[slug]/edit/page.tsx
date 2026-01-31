"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

const mockProject = {
  name: "个人作品集网站",
  slug: "portfolio-website",
  description: "现代化个人作品集网站",
  content: "详细介绍...",
  tech_stack: ["Next.js", "FastAPI"],
  github_url: "https://github.com",
  demo_url: "",
  featured: true,
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(mockProject);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/projects");
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
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回项目
        </Link>
      </Button>

      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>编辑项目</CardTitle>
          <CardDescription>修改项目信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="input-glow"
              />
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
                      className="input-glow flex-1"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeTech(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                  GitHub URL
                </label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="input-glow"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="demo_url" className="text-sm font-medium">
                  演示 URL
                </label>
                <Input
                  id="demo_url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="input-glow"
                />
              </div>
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
                精选项目
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/projects">取消</Link>
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
