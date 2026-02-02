import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Zap, ArrowRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getServices() {
  try {
    const res = await fetch(`${API_BASE}/api/services`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="page-container">
      <section className="page-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="page-title">服务咨询</h1>
            <p className="page-description">提供专业的Web开发、API设计等服务</p>
          </div>
          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: any) => (
                <Card key={service.id} className="card-hover p-6">
                  <div className="icon-box mb-4"><Zap className="h-6 w-6 text-primary" /></div>
                  <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {service.price_from ? `¥${service.price_from}+` : "详询"}
                    </span>
                    <Link href={`/services/${service.slug}`} className="inline-flex items-center text-sm font-medium text-primary">
                      了解更多 <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="icon-box mx-auto mb-4 w-16 h-16"><Zap className="h-8 w-8 text-primary" /></div>
              <h3 className="text-lg font-medium">暂无服务</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
