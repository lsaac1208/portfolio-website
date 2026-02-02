"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { portfolioApi } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Plus, Image } from "lucide-react";

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await portfolioApi.list();
        setItems(data as any[]);
      } catch (error) {
        console.error("获取作品失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">作品集管理</h1>
          <p className="text-muted-foreground">管理您的作品展示</p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="mr-2 h-4 w-4" />
            新建作品
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
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
                <p className="text-sm text-muted-foreground mb-4">{formatDate(item.created_at)}</p>
                <div className="flex items-center justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/portfolio/${item.id}/edit`}>编辑</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-base p-12 text-center">
          <div className="icon-box mx-auto mb-4 w-16 h-16">
            <Image className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">暂无作品</h3>
          <Button asChild>
            <Link href="/admin/portfolio/new">
              <Plus className="mr-2 h-4 w-4" />
              新建作品
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
