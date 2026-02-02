import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Code2, Coffee, Sparkles, Heart } from "lucide-react";

export default function About() {
  const techStack = [
    { category: "Frontend", items: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { category: "Backend", items: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Redis"] },
    { category: "DevOps", items: ["Docker", "Nginx", "Linux", "Git", "CI/CD"] },
    { category: "Tools", items: ["VS Code", "Figma", "Postman", "GitHub", "Vercel"] },
  ];

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 group">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center animate-float shadow-2xl shadow-primary/20">
              <Code2 className="w-12 h-12 text-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-in">
            关于我
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-in" style={{ animationDelay: "0.1s" }}>
            全栈开发者，专注于构建高质量的 Web 应用和数字化解决方案。
            热爱开源、分享和技术创新。
          </p>
        </div>
      </section>

      {/* 我的故事 */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bento-grid animate-stagger">
            {/* 故事卡片 */}
            <div className="bento-item bento-wide p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="icon-wrap-lg flex-shrink-0">
                  <Coffee className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-4">我的故事</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      我是一名热爱编程的全栈开发者，拥有多年的 Web 开发经验。
                      从最初的前端切图仔，到现在的全栈工程师，这条路充满了挑战和成长。
                    </p>
                    <p>
                      我相信技术可以让世界变得更美好，也相信好的代码是一种艺术。
                      无论是性能优化、用户体验，还是代码质量，我都会精益求精。
                    </p>
                    <p>
                      业余时间，我会写技术博客、参与开源项目、学习新技术。
                      也喜欢咖啡、摄影和旅行。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 理念卡片 */}
            <div className="bento-item p-6">
              <div className="icon-wrap-md mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">我的理念</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "代码即艺术，精益求精",
                  "用户体验至上",
                  "持续学习，不断进步",
                  "开源精神，分享共赢"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 未来规划卡片 */}
            <div className="bento-item p-6">
              <div className="icon-wrap-md mb-4">
                <ArrowRight className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">未来规划</h3>
              <p className="text-sm text-muted-foreground mb-4">
                持续深耕 Web 技术，探索 AI 与 Web 的结合，
                打造更多有影响力的开源项目。
              </p>
              <Link href="/projects" className="btn btn-secondary btn-sm">
                查看项目
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 技术栈详情 */}
      <section className="py-16 lg:py-24 px-6 bg-spotlight">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="page-title mb-4">技术栈</h2>
            <p className="page-subtitle">我熟悉的工具和技术</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
            {techStack.map((stack) => (
              <div key={stack.category} className="bento-item p-6 hover-lift">
                <h3 className="font-semibold text-foreground mb-4">{stack.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <span key={item} className="badge-outline px-2.5 py-1 text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我 */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bento-item p-8">
            <div className="icon-wrap-md mx-auto mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h2 className="page-title mb-4">联系我</h2>
            <p className="page-subtitle mb-8">
              如果你有合作意向或有任何问题，欢迎通过邮箱联系我
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                发送邮件
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
