"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Search, Eye, Mail, Phone, Calendar, DollarSign, CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { inquiryApi, showError, showSuccess } from "@/lib/api-client";
import type { Inquiry, InquiryStatus } from "@/lib/types";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "待处理", variant: "default" },
  contacted: { label: "已联系", variant: "secondary" },
  quoted: { label: "已报价", variant: "outline" },
  closed: { label: "已关闭", variant: "destructive" },
};

export default function AdminInquiriesPage() {
  const [search, setSearch] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await inquiryApi.list();
      setInquiries(data);
    } catch (error) {
      showError("获取询价列表失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry.client_name.toLowerCase().includes(search.toLowerCase()) ||
    inquiry.client_email.toLowerCase().includes(search.toLowerCase()) ||
    (inquiry.description && inquiry.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpdateStatus = async (id: number, newStatus: InquiryStatus) => {
    setProcessing(id);
    try {
      await inquiryApi.update(id, { status: newStatus });
      setInquiries(
        inquiries.map((i) =>
          i.id === id ? { ...i, status: newStatus } : i
        )
      );
      setSelectedInquiry(
        selectedInquiry && selectedInquiry.id === id
          ? { ...selectedInquiry, status: newStatus }
          : selectedInquiry
      );
      showSuccess("状态已更新");
    } catch (error) {
      showError("更新失败");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">询价管理</h1>
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">询价管理</h1>
        <p className="text-muted-foreground mt-1">管理客户询价和订单</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 询价列表 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索询价..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-glow"
            />
          </div>

          {/* 列表 */}
          <Card className="gradient-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedInquiry?.id === inquiry.id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{inquiry.client_name}</span>
                          <Badge variant={statusMap[inquiry.status]?.variant || "secondary"}>
                            {statusMap[inquiry.status]?.label || inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">{inquiry.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(inquiry.created_at)}
                          </span>
                          <span>{inquiry.service?.name || "未指定"}</span>
                          <span>{inquiry.budget || "未指定"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {filteredInquiries.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              没有找到相关询价
            </div>
          )}
        </div>

        {/* 详情面板 */}
        <div className="space-y-4">
          {selectedInquiry ? (
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle>询价详情</CardTitle>
                <CardDescription>ID: #{selectedInquiry.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">客户姓名</label>
                  <p className="font-medium">{selectedInquiry.client_name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">联系方式</label>
                  <div className="space-y-1 mt-1">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedInquiry.client_email}
                    </p>
                    {selectedInquiry.client_phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {selectedInquiry.client_phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">服务类型</label>
                  <p className="font-medium">{selectedInquiry.service?.name || "未指定"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">预算范围</label>
                  <p className="flex items-center gap-1 font-medium">
                    <DollarSign className="h-4 w-4" />
                    {selectedInquiry.budget || "未指定"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">需求描述</label>
                  <p className="mt-1 text-sm">{selectedInquiry.description}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">提交时间</label>
                  <p className="mt-1">{formatDate(selectedInquiry.created_at)}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <label className="text-sm text-muted-foreground mb-2 block">更新状态</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusMap).map(([status, config]) => (
                      <Button
                        key={status}
                        variant={selectedInquiry.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedInquiry.id, status as InquiryStatus)}
                        disabled={processing === selectedInquiry.id}
                      >
                        {processing === selectedInquiry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : null}
                        {config.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="gradient-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>选择一个询价查看详情</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
