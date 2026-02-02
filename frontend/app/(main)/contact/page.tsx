"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.send(formData);
      showSuccess("消息发送成功，我会尽快回复您！");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "发送失败";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "邮箱", value: "contact@example.com" },
    { icon: Phone, label: "电话", value: "+86 138 0000 0000" },
    { icon: MapPin, label: "位置", value: "中国·北京" },
  ];

  return (
    <div className="page-container">
      <section className="page-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* 标题 */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="page-title">联系我</h1>
            <p className="page-description">
              有问题或合作意向？请随时联系我
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-6 flex items-start gap-4">
                  <div className="icon-box-sm">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 联系表单 */}
            <Card className="card-base p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">发送消息</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">姓名</label>
                    <Input
                      id="name"
                      placeholder="您的姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">邮箱</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">主题</label>
                  <Input
                    id="subject"
                    placeholder="邮件主题"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">消息</label>
                  <Textarea
                    id="message"
                    placeholder="请输入您的消息..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="min-h-[150px] input-field"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "发送中..." : "发送消息"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
