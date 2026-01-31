import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Zap, Code, Globe, Server } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const iconMap: Record<string, any> = {
  Globe,
  Server,
  Zap,
  Code,
};

async function getServices() {
  try {
    const res = await fetch(`${API_BASE}/api/services`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  if (!services.length) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            服务项目
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            提供专业的技术开发服务
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          暂无服务
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          服务项目
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          提供专业的技术开发服务
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {services.map((service: any) => {
          const Icon = iconMap[service.icon || ""] || Code;
          return (
            <Card key={service.id} className="gradient-border card-hover flex flex-col">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {service.price_type === "hourly"
                      ? `¥${service.price_from}/小时`
                      : service.price_type === "custom"
                      ? "定制"
                      : service.price_from
                      ? `¥${service.price_from}起`
                      : "面议"}
                  </span>
                </div>
                <ul className="space-y-2">
                  {(service.features || []).map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {service.estimated_days && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    预计 {service.estimated_days} 天完成
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/services/${service.slug}`}>了解更多</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href={`/pricing?service=${service.slug}`}>立即咨询</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
