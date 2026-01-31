"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin/sidebar";
import { authApi } from "@/lib/api-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) {
          router.push("/login");
        }
        return;
      }

      try {
        const user = await authApi.getCurrentUser();
        if (!isMounted) return;

        if (user.role !== "ADMIN") {
          // 非管理员用户，跳转到首页
          router.push("/");
          return;
        }
        setIsAdmin(true);
      } catch {
        if (!isMounted) return;
        // Token 无效，跳转到登录页
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background tech-grid">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
