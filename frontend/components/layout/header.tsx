"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, Code2, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "首页", href: "/" },
  { name: "博客", href: "/blog" },
  { name: "论坛", href: "/forum" },
  { name: "项目", href: "/projects" },
  { name: "作品集", href: "/portfolio" },
  { name: "服务", href: "/services" },
  { name: "关于", href: "/about" },
  { name: "联系", href: "/contact" },
];

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    setIsLoggedIn(!!token);
    setUserName(name || "用户");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              My<span className="text-primary">Portfolio</span>
            </span>
          </Link>
        </div>

        {/* 桌面导航 */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-foreground/80 hover:text-primary transition-colors link-glow"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* 用户状态 */}
        <div className="hidden lg:flex lg:gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/admin/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  管理后台
                </Link>
              </Button>
              <div className="flex items-center gap-2 px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="退出登录">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild>
                <Link href="/register">注册</Link>
              </Button>
            </>
          )}
        </div>

        {/* 移动端菜单按钮 */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">打开菜单</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <div
        className={cn(
          "lg:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 px-6 pb-3 pt-2 glass-card mx-4 mt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-2 text-base font-semibold text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                href="/admin"
                className="block py-2 text-base font-semibold text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                管理后台
              </Link>
              <div className="flex items-center gap-2 py-2">
                <User className="h-5 w-5" />
                <span>{userName}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 text-base font-semibold text-destructive"
              >
                <LogOut className="h-5 w-5" />
                退出登录
              </button>
            </>
          ) : (
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" className="flex-1" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/register">注册</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
