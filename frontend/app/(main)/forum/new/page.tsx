"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";

export default function NewTopicPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push("/forum");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/forum">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回论坛
        </Link>
      </Button>

      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>发布新话题</CardTitle>
          <CardDescription>
            分享您的技术观点、提出问题或开始讨论
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                话题标题
              </label>
              <Input
                id="title"
                placeholder="请输入话题标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                话题内容
              </label>
              <Textarea
                id="content"
                placeholder="详细描述您的话题内容..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px] input-glow"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/forum">取消</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "发布中..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    发布话题
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
