"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, User, Eye, MessageSquare, Send, ThumbsUp } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { authApi, forumApi, showError, showSuccess } from "@/lib/api-client";
import type { Topic, Comment } from "@/lib/types";

export default function ForumTopicPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopic();
    fetchComments();
  }, [id]);

  const fetchTopic = async () => {
    try {
      const data = await forumApi.getTopic(parseInt(id));
      setTopic(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "话题不存在";
      showError(message);
      router.push("/forum");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await forumApi.getComments(parseInt(id));
      setComments(data);
    } catch (err) {
      console.error("加载评论失败:", err);
    }
  };

  // HTML转义函数
  const escapeHtml = (text: string): string => {
    return DOMPurify.sanitize(text);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    if (!authApi.isAuthenticated()) {
      showError("请先登录");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      const comment = await forumApi.addComment(parseInt(id), { content: newComment });
      setComments([...comments, comment]);
      setNewComment("");
      showSuccess("评论发布成功");
    } catch (err) {
      const message = err instanceof Error ? err.message : "评论失败";
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">话题不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/forum">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回论坛
        </Link>
      </Button>

      {/* 话题内容 */}
      <Card className="mb-8 gradient-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {escapeHtml(topic.author?.name || "匿名")}
            </span>
            <span>·</span>
            <span>{formatDate(topic.created_at)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {topic.views} 次浏览
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-4">
            {escapeHtml(topic.title)}
          </h1>
          <div className="prose prose-invert max-w-none">
            {topic.content.split('\n').map((line, idx) => (
              <p key={idx} className="text-muted-foreground whitespace-pre-wrap">
                {escapeHtml(line)}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 评论数量 */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <span className="font-semibold">{comments.length} 条评论</span>
      </div>

      {/* 发表评论 */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <Textarea
            placeholder="写下你的评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] mb-4 input-glow"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={submitting || !newComment.trim()}>
              <Send className="mr-2 h-4 w-4" />
              {submitting ? "发布中..." : "发布评论"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{escapeHtml(comment.author?.name || "匿名")}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {escapeHtml(comment.content)}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
