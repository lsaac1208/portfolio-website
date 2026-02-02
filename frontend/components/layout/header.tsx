"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "首页", href: "/" },
  { name: "关于", href: "/about" },
  { name: "项目", href: "/projects" },
  { name: "博客", href: "/blog" },
  { name: "服务", href: "/services" },
  { name: "论坛", href: "/forum" },
  { name: "联系", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 滚动检测
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 关闭移动端菜单
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 顶部导航 */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled 
            ? "glass border-b border-white/5 py-3 shadow-lg" 
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
                <Code2 className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                王亮
              </span>
            </Link>

            {/* 桌面导航 */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    pathname === item.href
                      ? "bg-white/10 text-foreground shadow-inner"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:scale-105"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="hover:bg-white/10">
                  登录
                </Button>
              </Link>
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/contact">联系我</Link>
              </Button>
              
              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                aria-label="菜单"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端菜单遮罩 */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* 移动端菜单 */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 lg:hidden transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="absolute inset-0 glass border-l border-white/10 p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-bold text-lg">王亮</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 py-3.5 text-base font-medium rounded-xl transition-all",
                  pathname === item.href
                    ? "bg-white/10 text-foreground shadow-inner"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <Link href="/admin" className="block" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">登录</Button>
            </Link>
            <Link href="/contact" className="block" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">联系我</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
