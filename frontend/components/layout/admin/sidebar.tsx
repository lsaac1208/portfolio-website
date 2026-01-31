"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  ShoppingCart,
  Users,
  Image,
  Briefcase,
  Settings,
  LogOut,
  Code2,
} from "lucide-react";

const navigation = [
  { name: "仪表盘", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "文章管理", href: "/admin/blog", icon: FileText },
  { name: "项目管理", href: "/admin/projects", icon: FolderKanban },
  { name: "作品集管理", href: "/admin/portfolio", icon: Image },
  { name: "服务管理", href: "/admin/services", icon: Briefcase },
  { name: "论坛管理", href: "/admin/forum", icon: MessageSquare },
  { name: "询价订单", href: "/admin/inquiries", icon: ShoppingCart },
  { name: "用户管理", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col glass border-r border-border/50">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border/50">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            My<span className="text-primary">Portfolio</span>
          </span>
        </Link>
      </div>

      {/* 导航 */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary neon-glow"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 底部 */}
      <div className="border-t border-border/50 p-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          网站首页
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          退出登录
        </button>
      </div>
    </div>
  );
}
