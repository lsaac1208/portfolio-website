"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serviceApi } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Plus, Zap } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceApi.list();
        setServices(data as any[]);
      } catch (error) {
        console.error("获取服务失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">服务管理</h1>
          <p className="text-muted-foreground">管理您的服务项目</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            新建服务
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : services.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="icon-box">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <span className={`badge ${service.active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`}>
                  {service.active ? "上架" : "下架"}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {service.price_from ? `¥${service.price_from}+` : "详询"}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/services/${service.slug}/edit`}>编辑</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-base p-12 text-center">
          <div className="icon-box mx-auto mb-4 w-16 h-16">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">暂无服务</h3>
          <p className="text-muted-foreground mb-4">开始添加您的第一个服务</p>
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="mr-2 h-4 w-4" />
              新建服务
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
