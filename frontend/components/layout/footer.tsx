import Link from "next/link";
import { Github, Twitter, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t border-border/50 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 关于 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              关于我
            </h3>
            <p className="text-sm text-muted-foreground">
              全栈开发者，热爱技术与创作。这里是我的个人展示网站，分享我的作品和经验。
            </p>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              快速链接
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  博客
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  项目展示
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">
                  作品集
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  服务
                </Link>
              </li>
            </ul>
          </div>

          {/* 服务 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              服务
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/web-development" className="text-muted-foreground hover:text-primary transition-colors">
                  Web开发
                </Link>
              </li>
              <li>
                <Link href="/services/api-development" className="text-muted-foreground hover:text-primary transition-colors">
                  API开发
                </Link>
              </li>
              <li>
                <Link href="/services/consulting" className="text-muted-foreground hover:text-primary transition-colors">
                  技术咨询
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  定价
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              联系方式
            </h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              合作或咨询，请随时联系
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} MyPortfolio. All rights reserved. Made with{" "}
            <Heart className="inline h-4 w-4 text-secondary" /> by Me
          </p>
        </div>
      </div>
    </footer>
  );
}
