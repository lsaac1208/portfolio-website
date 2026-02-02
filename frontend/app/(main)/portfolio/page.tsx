import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Image, ArrowRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getPortfolio() {
  try {
    const res = await fetch(`${API_BASE}/api/portfolio`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export default async function PortfolioPage() {
  const items = await getPortfolio();

  return (
    <div className="page-container">
      <section className="page-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="page-title">作品集</h1>
            <p className="page-description">精选作品展示，瀑布流布局呈现</p>
          </div>
          {items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item: any) => (
                <Card key={item.id} className="card-hover overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="badge mb-3">{item.category}</span>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
                    {item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noopener" className="inline-flex items-center text-sm font-medium text-primary">
                        查看详情 <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="icon-box mx-auto mb-4 w-16 h-16"><Image className="h-8 w-8 text-primary" /></div>
              <h3 className="text-lg font-medium">暂无作品</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
