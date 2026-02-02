"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { inquiryApi } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Zap, Mail, Phone, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  contacted: "bg-blue-500/10 text-blue-500",
  quoted: "bg-green-500/10 text-green-500",
  closed: "bg-gray-500/10 text-gray-500",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await inquiryApi.list();
        setInquiries(data as any[]);
      } catch (error) {
        console.error("获取询价失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">询价管理</h1>
        <p className="text-muted-foreground">查看和管理客户询价</p>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : inquiries.length > 0 ? (
        <Card className="card-base">
          <div className="divide-y divide-border/50">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="icon-box">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{inquiry.client_name}</h3>
                      <p className="text-sm text-muted-foreground">{inquiry.project_type}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[inquiry.status] || "bg-gray-500/10 text-gray-500"}`}>
                    {inquiry.status || "pending"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {inquiry.client_email}
                  </div>
                  {inquiry.client_phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {inquiry.client_phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(inquiry.created_at)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {inquiry.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="card-base p-12 text-center">
          <div className="icon-box mx-auto mb-4 w-16 h-16">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">暂无询价</h3>
          <p className="text-muted-foreground">等待客户提交询价</p>
        </Card>
      )}
    </div>
  );
}
