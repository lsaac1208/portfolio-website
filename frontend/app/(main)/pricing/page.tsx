"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";

const pricingPlans = [
  {
    name: "基础版",
    description: "适合小型网站和简单应用",
    price: 5000,
    features: [
      "响应式网站设计",
      "最多 5 个页面",
      "联系表单",
      "基础SEO优化",
      "3 个月技术支持",
    ],
    limitations: [
      "无后台管理系统",
      "无在线支付",
      "无多语言支持",
    ],
  },
  {
    name: "专业版",
    description: "适合中小型企业网站",
    price: 15000,
    popular: true,
    features: [
      "完整网站设计",
      "最多 15 个页面",
      "后台管理系统",
      "用户注册/登录",
      "高级SEO优化",
      "在线支付集成",
      "6 个月技术支持",
    ],
    limitations: [],
  },
  {
    name: "企业版",
    description: "适合大型应用和定制需求",
    price: 50000,
    features: [
      "全定制开发",
      "无限页面",
      "完整后台系统",
      "多用户/权限管理",
      "高级数据分析",
      "多语言支持",
      "性能优化",
      "12 个月技术支持",
    ],
    limitations: [],
  },
];

const addOns = [
  { name: "Logo 设计", price: 1000 },
  { name: "图片素材", price: 500 },
  { name: "多语言支持", price: 2000 },
  { name: "SEO 优化套餐", price: 1500 },
  { name: "一个月技术支持", price: 1000 },
];

function PricingContent() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);

  const toggleAddOn = (index: number) => {
    setSelectedAddOns((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          定价方案
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          选择适合您的方案，或定制您的需求
        </p>
        {serviceSlug && (
          <p className="mt-2 text-sm text-primary">
            您选择了服务: {serviceSlug}
          </p>
        )}
      </div>

      {/* 定价卡片 */}
      <div className="grid gap-8 lg:grid-cols-3 mb-16">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`gradient-border relative ${
              plan.popular ? "border-primary/50" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  推荐方案
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">¥{plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground"> 起</span>
              </div>
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation) => (
                  <div key={limitation} className="flex items-center gap-2 text-muted-foreground">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href="/contact">开始咨询</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 增值服务 */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
          增值服务
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {addOns.map((addOn, idx) => (
            <Card
              key={addOn.name}
              className={`cursor-pointer transition-all ${
                selectedAddOns.includes(idx)
                  ? "border-primary neon-glow"
                  : "gradient-border"
              }`}
              onClick={() => toggleAddOn(idx)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{addOn.name}</div>
                <div className="text-lg font-bold text-primary mt-1">
                  +¥{addOn.price.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          定价方案
        </h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="gradient-border">
            <CardHeader>
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 w-full bg-muted animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PricingContent />
    </Suspense>
  );
}
