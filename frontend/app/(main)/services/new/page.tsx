"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, DollarSign, Clock, Plus, Trash2 } from "lucide-react";

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    content: "",
    price_type: "fixed",
    price_from: "",
    price_to: "",
    features: [""],
    estimated_days: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/services");
  };

  const handleSlugify = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回服务
        </Link>
      </Button>

      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>添加新服务</CardTitle>
          <CardDescription>添加新的服务项目</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  服务名称
                </label>
                <Input
                  id="name"
                  placeholder="Web应用开发"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-glow"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  URL Slug
                </label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    placeholder="service-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="input-glow flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleSlugify}>
                    生成
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                简短描述
              </label>
              <Textarea
                id="description"
                placeholder="一句话描述服务..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">定价方式</label>
              <div className="flex gap-4">
                {["fixed", "hourly", "custom"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price_type"
                      value={type}
                      checked={formData.price_type === type}
                      onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">
                      {type === "fixed" && "固定价格"}
                      {type === "hourly" && "按小时计费"}
                      {type === "custom" && "定制报价"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="price_from" className="text-sm font-medium">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  起始价格
                </label>
                <Input
                  id="price_from"
                  type="number"
                  placeholder="5000"
                  value={formData.price_from}
                  onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
                  className="input-glow"
                />
              </div>
              {formData.price_type === "fixed" && (
                <div className="space-y-2">
                  <label htmlFor="price_to" className="text-sm font-medium">
                    结束价格
                  </label>
                  <Input
                    id="price_to"
                    type="number"
                    placeholder="50000"
                    value={formData.price_to}
                    onChange={(e) => setFormData({ ...formData, price_to: e.target.value })}
                    className="input-glow"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">功能列表</label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="功能描述"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="input-glow flex-1"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加功能
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="estimated_days" className="text-sm font-medium">
                <Clock className="inline h-4 w-4 mr-1" />
                预估完成天数
              </label>
              <Input
                id="estimated_days"
                type="number"
                placeholder="14"
                value={formData.estimated_days}
                onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
                className="input-glow w-32"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                详细介绍
              </label>
              <Textarea
                id="content"
                placeholder="详细介绍服务内容、流程、交付物等..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[200px] input-glow"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/services">取消</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "保存中..." : "保存服务"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
