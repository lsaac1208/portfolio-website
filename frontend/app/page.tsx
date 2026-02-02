import Link from "next/link";
import { ArrowRight, Github, Mail, Code2, Sparkles, Zap, FileText, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="page-container">
      {/* Hero Section - 沉浸式设计 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-grid" />
        
        {/* 动态背景光晕 */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent/8 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[60px] animate-pulse-soft" style={{ animationDelay: "2s" }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* 头像/标识 - 带悬浮效果 */}
          <div className="relative inline-block mb-8 group">
            <div className="relative w-28 h-28 mx-auto">
              {/* 外圈光晕 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-soft opacity-30 blur-xl" />
              {/* 主容器 */}
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center animate-float shadow-2xl shadow-primary/20">
                <Code2 className="w-14 h-14 text-foreground" />
              </div>
              {/* 状态指示器 */}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-green-500 border-4 border-background flex items-center justify-center animate-bounce-soft shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* 标题 - 大字体 + 渐变 */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter mb-6 animate-in">
            <span className="text-gradient animate-gradient bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              全栈开发者
            </span>
            <br />
            <span className="text-foreground">王亮</span>
          </h1>
          
          {/* 副标题 */}
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed-sm animate-in" style={{ animationDelay: "0.1s" }}>
            专注于构建高质量的 Web 应用和数字化解决方案
            <br />
            <span className="text-sm text-muted-foreground/70">热爱开源、分享和技术创新</span>
          </p>
          
          {/* CTA 按钮组 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in" style={{ animationDelay: "0.2s" }}>
            <Link 
              href="/projects" 
              className="btn btn-primary btn-lg hover-lift hover-glow group"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse-soft" />
              查看项目
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/contact" 
              className="btn btn-secondary btn-lg hover-lift"
            >
              联系我
            </Link>
          </div>
          
          {/* 社交链接 - 带图标悬浮效果 */}
          <div className="flex justify-center gap-4 animate-in" style={{ animationDelay: "0.3s" }}>
            {[
              { icon: Github, href: "https://github.com", label: "GitHub" },
              { icon: Mail, href: "mailto:contact@example.com", label: "邮箱" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="icon-wrap-md interactive hover:scale-110 hover:bg-primary/20"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
        
        {/* 向下滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft">
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-3 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Bento Grid 统计区 - 响应式卡片 */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bento-grid animate-stagger">
            {/* 项目统计 - Featured */}
            <Link href="/projects" className="bento-item bento-featured p-8 group">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="icon-wrap-lg">
                  <Code2 className="w-8 h-8 text-primary" />
                </div>
                {/* 装饰性数字 */}
                <span className="text-6xl font-bold text-white/5 select-none">10+</span>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-3">项目展示</h3>
              <p className="text-muted-foreground mb-4">展示开源项目、个人作品和技术实践</p>
              
              <div className="flex items-baseline gap-2">
                <span className="stat-value">10+</span>
                <span className="text-sm text-muted-foreground">已完成项目</span>
              </div>
            </Link>
            
            {/* 博客 */}
            <Link href="/blog" className="bento-item p-6 group">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              
              <div className="icon-wrap-md mb-4">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">技术博客</h3>
              <p className="text-sm text-muted-foreground mb-4">分享技术文章和经验总结</p>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">50+</span>
                <span className="text-xs text-muted-foreground">篇文章</span>
              </div>
            </Link>
            
            {/* 服务 */}
            <Link href="/services" className="bento-item p-6 group">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              
              <div className="icon-wrap-md mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">服务咨询</h3>
              <p className="text-sm text-muted-foreground mb-4">Web开发、API设计服务</p>
              
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                了解更多 <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            
            {/* 论坛 */}
            <Link href="/forum" className="bento-item bento-wide p-6 group">
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <div className="icon-wrap-md">
                    <MessageSquare className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">技术论坛</h3>
                    <p className="text-sm text-muted-foreground">技术讨论、问题解答、社区互动</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                <div>
                  <div className="text-2xl font-bold text-foreground">200+</div>
                  <div className="text-xs text-muted-foreground">活跃用户</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-xs text-muted-foreground">讨论话题</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">1k+</div>
                  <div className="text-xs text-muted-foreground">总回复</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 技术栈 - 标签云 */}
      <section className="py-16 lg:py-24 px-6 bg-spotlight">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="page-title mb-4">技术栈</h2>
          <p className="page-subtitle mb-12">使用现代技术栈构建高质量应用</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 14", "React 18", "TypeScript", "Tailwind CSS", 
              "Python", "FastAPI", "Node.js", "PostgreSQL", 
              "Docker", "Redis", "Git", "Linux"
            ].map((tech, index) => (
              <span 
                key={tech}
                className="badge-primary px-4 py-2.5 text-sm hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all cursor-default animate-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border-card p-8 sm:p-12 text-center hover-lift">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              准备好开始合作了吗？
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              无论您是想要构建一个网站、开发一个应用，还是需要技术咨询，我都很乐意帮助您。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-primary">
                <Mail className="w-4 h-4" />
                联系我
              </Link>
              <Link href="/about" className="btn btn-outline">
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
