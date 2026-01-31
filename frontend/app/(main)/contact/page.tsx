"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { contactApi, showError, showSuccess } from "@/lib/api-client";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.send(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      showSuccess("消息发送成功，我会尽快回复您！");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "发送失败，请稍后重试";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          联系我
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          有问题或合作意向？请随时联系我
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 联系信息 */}
        <div className="space-y-6">
          <Card className="gradient-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">邮箱</h3>
                  <p className="text-muted-foreground">contact@example.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">电话</h3>
                  <p className="text-muted-foreground">+86 138 0000 0000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">位置</h3>
                  <p className="text-muted-foreground">中国·北京</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 联系表单 */}
        <Card className="gradient-border">
          <CardHeader>
            <CardTitle>发送消息</CardTitle>
            <CardDescription>
              填写以下表单，我会尽快回复您
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {success && (
                <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-md">
                  消息发送成功，我会尽快回复您！
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    姓名
                  </label>
                  <Input
                    id="name"
                    placeholder="您的姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input-glow"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    邮箱
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input-glow"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  主题
                </label>
                <Input
                  id="subject"
                  placeholder="邮件主题"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="input-glow"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  消息
                </label>
                <Textarea
                  id="message"
                  placeholder="请输入您的消息..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="min-h-[150px] input-glow"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "发送中..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    发送消息
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
