import Link from "next/link";
import { Github, Mail, Code2, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    项目: [
      { name: "全部项目", href: "/projects" },
      { name: "开源项目", href: "https://github.com" },
    ],
    资源: [
      { name: "技术博客", href: "/blog" },
      { name: "技术论坛", href: "/forum" },
    ],
    服务: [
      { name: "Web 开发", href: "/services" },
      { name: "API 设计", href: "/services" },
    ],
    关于: [
      { name: "关于我", href: "/about" },
      { name: "联系我", href: "/contact" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Mail, href: "mailto:contact@example.com", label: "邮箱" },
  ];

  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {/* 顶部：Logo 和 社交链接 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <Code2 className="w-6 h-6 text-foreground" />
            </div>
            <span className="font-bold text-xl">王亮</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="icon-wrap-sm interactive hover:bg-primary/20"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* 中间：链接网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部：版权 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            © {currentYear} 王亮. 保留所有权利.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse-soft" />
            <span>by Claude</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
