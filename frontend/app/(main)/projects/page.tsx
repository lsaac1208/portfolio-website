import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Star, Code } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  if (!projects.length) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            项目展示
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            我的开源项目和个人作品
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          暂无项目
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          项目展示
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          我的开源项目和个人作品
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project: any) => (
          <Card key={project.id} className="gradient-border card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    <Link href={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
                      {project.name}
                    </Link>
                  </CardTitle>
                  {project.featured && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Star className="h-3 w-3" />
                      <span>精选项目</span>
                    </div>
                  )}
                </div>
              </div>
              <CardDescription className="mt-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tech_stack || []).map((tech: string) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.github_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-1" />
                      代码
                    </a>
                  </Button>
                )}
                {project.demo_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      演示
                    </a>
                  </Button>
                )}
                <Button size="sm" asChild>
                  <Link href={`/projects/${project.slug}`}>
                    <Code className="h-4 w-4 mr-1" />
                    详情
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
