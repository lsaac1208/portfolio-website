"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api-client";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    if (!authApi.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // 跳转到仪表盘
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">正在跳转到管理后台...</p>
      </div>
    </div>
  );
}
