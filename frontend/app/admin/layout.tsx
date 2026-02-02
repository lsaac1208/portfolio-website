"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, FileText, Briefcase, Image, Zap, 
  MessageSquare, Users, LogOut, Menu, X, Code2 
} from "lucide-react";
import { authApi } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "仪表盘", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "博客管理", href: "/admin/blog", icon: FileText },
  { name: "项目管理", href: "/admin/projects", icon: Briefcase },
  { name: "作品集", href: "/admin/portfolio", icon: Image },
  { name: "服务管理", href: "/admin/services", icon: Zap },
  { name: "询价管理", href: "/admin/inquiries", icon: MessageSquare },
  { name: "论坛管理", href: "/admin/forum", icon: MessageSquare },
  { name: "用户管理", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      try {
        const user = await authApi.getCurrentUser();
        if (user.role?.toLowerCase() === "admin") {
          setIsAdmin(true);
          setUserName(user.name || "管理员");
        } else { router.push("/"); }
      } catch { router.push("/login"); }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><div className="loading-spinner" /></div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen tech-grid">
      {/* 移动端头部 */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-semibold">管理后台</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-16">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed top-16 left-4 right-4 bottom-4 glass-card rounded-xl p-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-border/50 mt-4 pt-4">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">退出登录</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 glass border-r border-border/40 flex-col">
        <div className="p-6 border-b border-border/40">
          <Link href="/admin" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">管理后台</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3 mb-3 px-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">管理员</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="lg:pl-64 min-h-screen">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
