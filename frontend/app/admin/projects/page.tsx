"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectApi } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Plus, Briefcase } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.list();
        setProjects(data as any[]);
      } catch (error) {
        console.error("获取项目失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">项目管理</h1>
          <p className="text-muted-foreground">管理您的项目作品</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            新建项目
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="icon-box">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <span className={`badge ${project.featured ? "bg-primary/10 text-primary" : ""}`}>
                  {project.featured ? "精选" : ""}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{formatDate(project.created_at)}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/projects/${project.slug}/edit`}>编辑</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-base p-12 text-center">
          <div className="icon-box mx-auto mb-4 w-16 h-16">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">暂无项目</h3>
          <p className="text-muted-foreground mb-4">开始添加您的第一个项目</p>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              新建项目
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
