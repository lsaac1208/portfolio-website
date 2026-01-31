"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, DollarSign, Clock, Check, Loader2 } from "lucide-react";
import { serviceApi, showError, showSuccess } from "@/lib/api-client";
import type { Service } from "@/lib/types";

export default function AdminServicesPage() {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await serviceApi.list();
      setServices(data);
    } catch (error) {
      showError("获取服务列表失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number, slug: string) => {
    if (!confirm("确定要删除这个服务吗？")) return;

    setProcessing(id);
    try {
      await serviceApi.delete(slug);
      setServices(services.filter((s) => s.id !== id));
      showSuccess("服务已删除");
    } catch (error) {
      showError("删除失败");
    } finally {
      setProcessing(null);
    }
  };

  const handleToggle = async (id: number, slug: string, currentStatus: boolean) => {
    setProcessing(id);
    try {
      await serviceApi.update(slug, { active: !currentStatus });
      setServices(
        services.map((s) =>
          s.id === id ? { ...s, active: !currentStatus } : s
        )
      );
      showSuccess(!currentStatus ? "服务已上架" : "服务已下架");
    } catch (error) {
      showError("操作失败");
    } finally {
      setProcessing(null);
    }
  };

  const getPriceDisplay = (service: Service) => {
    if (service.price_type === "hourly") {
      return `¥${service.price_from}/小时`;
    } else if (service.price_type === "custom") {
      return "定制报价";
    }
    return `¥${service.price_from} - ¥${service.price_to}`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">服务管理</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">服务管理</h1>
          <p className="text-muted-foreground mt-1">管理您的服务项目</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            添加服务
          </Link>
        </Button>
      </div>

      {/* 搜索 */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索服务..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 input-glow"
          />
        </div>
      </div>

      {/* 服务列表 */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredServices.map((service) => (
          <Card key={service.id} className="gradient-border card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {service.name}
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "上架中" : "已下架"}
                    </Badge>
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-medium">{getPriceDisplay(service)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>预计 {service.estimated_days || "-"} 天</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/services/${service.slug}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(service.id, service.slug, service.active)}
                  disabled={processing === service.id}
                >
                  {processing === service.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  {service.active ? "下架" : "上架"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(service.id, service.slug)}
                  disabled={processing === service.id}
                >
                  {processing === service.id ? (
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

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          没有找到相关服务
        </div>
      )}
    </div>
  );
}
