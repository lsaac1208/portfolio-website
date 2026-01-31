"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Image, Link as LinkIcon, Loader2 } from "lucide-react";
import { portfolioApi, showError, showSuccess } from "@/lib/api-client";
import type { Portfolio } from "@/lib/types";

const categories = [
  { value: "all", label: "全部" },
  { value: "design", label: "UI设计" },
  { value: "photography", label: "摄影" },
  { value: "illustration", label: "插画" },
];

export default function AdminPortfolioPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await portfolioApi.list();
      setPortfolio(data);
    } catch (error) {
      showError("获取作品集失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolio = portfolio.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个作品吗？")) return;

    setDeleting(id);
    try {
      await portfolioApi.delete(id);
      setPortfolio(portfolio.filter((p) => p.id !== id));
      showSuccess("作品已删除");
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
          <h1 className="text-3xl font-bold tracking-tight">作品集管理</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">作品集管理</h1>
          <p className="text-muted-foreground mt-1">管理您的设计、摄影和插画作品</p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="mr-2 h-4 w-4" />
            添加作品
          </Link>
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索作品..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 input-glow"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={filter === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 作品网格 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPortfolio.map((item) => (
          <Card key={item.id} className="gradient-border card-hover overflow-hidden">
            <div className="aspect-square bg-muted relative">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {categories.find((c) => c.value === item.category)?.label}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description || ""}</p>
              <div className="flex items-center gap-2 mt-3">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/portfolio/${item.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                {item.link_url && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={item.link_url} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                >
                  {deleting === item.id ? (
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

      {filteredPortfolio.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          没有找到相关作品
        </div>
      )}
    </div>
  );
}
