"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { met: password.length >= 8, text: "至少8个字符" },
    { met: /[A-Z]/.test(password), text: "包含大写字母" },
    { met: /[a-z]/.test(password), text: "包含小写字母" },
    { met: /[0-9]/.test(password), text: "包含数字" },
    { met: /[!@#$%^&*(),.?\":{}|<>]/.test(password), text: "包含特殊字符" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    // 前端密码强度检查
    const requirementsMet = passwordRequirements.filter(r => r.met).length;
    if (requirementsMet < 5) {
      setError("密码强度不足，请满足所有密码要求");
      return;
    }

    setLoading(true);

    try {
      await authApi.register(email, password, name);
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "注册失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md gradient-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">注册</CardTitle>
          <CardDescription className="text-center">
            创建您的账号
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                昵称
              </label>
              <Input
                id="name"
                type="text"
                placeholder="您的昵称"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-glow"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-glow"
              />
              {/* 密码强度提示 */}
              <div className="text-xs space-y-1 mt-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className={`flex items-center gap-1 ${req.met ? "text-green-500" : "text-muted-foreground"}`}>
                    <span>{req.met ? "✓" : "○"}</span>
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                确认密码
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-glow"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "注册中..." : "注册"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              已有账号？{" "}
              <Link href="/login" className="text-primary hover:underline">
                立即登录
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
