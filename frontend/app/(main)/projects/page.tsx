import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Code, ArrowRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="page-container">
      <section className="page-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="page-title">项目展示</h1>
            <p className="page-description">展示开源项目、个人作品和技术实践</p>
          </div>
          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project: any) => (
                <Card key={project.id} className="card-hover p-6">
                  <div className="icon-box mb-4"><Code className="h-6 w-6 text-primary" /></div>
                  <h3 className="font-semibold text-foreground mb-2">
                    <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <Link href={`/projects/${project.slug}`} className="inline-flex items-center text-sm font-medium text-primary">
                    了解更多 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="icon-box mx-auto mb-4 w-16 h-16"><Code className="h-8 w-8 text-primary" /></div>
              <h3 className="text-lg font-medium">暂无项目</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
