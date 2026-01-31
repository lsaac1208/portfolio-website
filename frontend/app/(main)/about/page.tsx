import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Database, Globe, Server, Terminal, Cpu, Layers, Smartphone } from "lucide-react";

const skills = [
  { name: "Frontend", icon: Globe, items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { name: "Backend", icon: Server, items: ["FastAPI", "Node.js", "Python", "Go"] },
  { name: "Database", icon: Database, items: ["PostgreSQL", "MongoDB", "Redis", "SQLite"] },
  { name: "DevOps", icon: Terminal, items: ["Docker", "Nginx", "Linux", "GitHub Actions"] },
  { name: "Mobile", icon: Smartphone, items: ["React Native", "Flutter"] },
  { name: "Other", icon: Cpu, items: ["GraphQL", "WebSocket", "REST API", "JWT"] },
];

const experiences = [
  {
    period: "2022 - 至今",
    role: "全栈开发者",
    company: "科技公司",
    description: "负责公司核心产品的全栈开发，包括前端架构设计、后端API开发和DevOps建设。",
  },
  {
    period: "2020 - 2022",
    role: "前端开发工程师",
    company: "互联网公司",
    description: "负责公司官网和后台管理系统的前端开发，使用React和TypeScript构建现代化界面。",
  },
  {
    period: "2018 - 2020",
    role: "后端开发工程师",
    company: "创业公司",
    description: "负责后端服务开发和维护，使用Python和Django构建RESTful API。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* 个人介绍 */}
      <div className="mb-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              关于我
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              我是一名热爱技术的全栈开发者，专注于构建高质量的 Web 应用和数字化解决方案。
              拥有多年开发经验，熟悉现代技术栈，喜欢探索新技术并分享知识。
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              在工作中，我注重代码质量和用户体验，追求简洁、高效、可维护的代码。
              业余时间，我喜欢开源贡献、技术写作和参加技术社区活动。
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild>
                <a href="/contact">联系我</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/projects">查看项目</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-20 blur-xl" />
            <div className="relative rounded-2xl glass-card p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">5+</div>
                <div className="text-muted-foreground">年开发经验</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 技术栈 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8">技术栈</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.name} className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <skill.icon className="h-5 w-5 text-primary" />
                  {skill.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 工作经验 */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-8">工作经验</h2>
        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <Card key={idx} className="gradient-border">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.role}</h3>
                    <p className="text-primary">{exp.company}</p>
                    <p className="mt-2 text-muted-foreground">{exp.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
