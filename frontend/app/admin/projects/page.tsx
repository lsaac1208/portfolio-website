"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Star, ExternalLink, Loader2 } from "lucide-react";
import { projectApi, showError, showSuccess } from "@/lib/api-client";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectApi.list();
      setProjects(data);
    } catch (error) {
      showError("获取项目列表失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number, slug: string) => {
    if (!confirm("确定要删除这个项目吗？")) return;

    setDeleting(id);
    try {
      await projectApi.delete(slug);
      setProjects(projects.filter((p) => p.id !== id));
      showSuccess("项目已删除");
    } catch (error) {
      showError("删除失败");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">项目管理</h1>
          <p className="text-muted-foreground mt-1">加载中...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">项目管理</h1>
          <p className="text-muted-foreground mt-1">管理您的项目展示</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            添加项目
          </Link>
        </Button>
      </div>

      {/* 搜索 */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索项目..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 input-glow"
          />
        </div>
      </div>

      {/* 项目网格 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="gradient-border card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <Link href={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
                      {project.name}
                    </Link>
                    {project.featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack?.map((tech: string) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/projects/${project.slug}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Link>
                </Button>
                {project.demo_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      演示
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(project.id, project.slug)}
                  disabled={deleting === project.id}
                >
                  {deleting === project.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          没有找到相关项目
        </div>
      )}
    </div>
  );
}
