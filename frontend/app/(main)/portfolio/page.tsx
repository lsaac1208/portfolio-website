"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { portfolioApi, showError } from "@/lib/api-client";
import type { Portfolio } from "@/lib/types";

const categories = [
  { name: "全部", value: "all" },
  { name: "UI 设计", value: "design" },
  { name: "摄影", value: "photography" },
  { name: "插画", value: "illustration" },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await portfolioApi.list();
      setPortfolioItems(data);
    } catch (error) {
      showError("获取作品集失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === "all"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          作品集
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          精选设计、摄影和插画作品
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? "default" : "outline"}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* 作品网格 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="group gradient-border overflow-hidden cursor-pointer card-hover"
          >
            <div className="aspect-square bg-muted relative overflow-hidden">
              {/* 占位图 - 实际应使用真实图片 */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary/30">
                  {item.id}
                </span>
              </div>
              {/* 悬停覆盖层 */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary">查看详情</Button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {categories.find(c => c.value === item.category)?.name}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
