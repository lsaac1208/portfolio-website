import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Cpu, Globe, Layers, Terminal, Zap } from "lucide-react";

const features = [
  {
    name: "博客系统",
    description: "分享技术文章、经验总结和思考感悟",
    icon: Terminal,
    href: "/blog",
  },
  {
    name: "论坛交流",
    description: "技术讨论、问题解答、社区互动",
    icon: Globe,
    href: "/forum",
  },
  {
    name: "项目展示",
    description: "展示开源项目、个人作品和技术实践",
    icon: Code,
    href: "/projects",
  },
  {
    name: "作品集",
    description: "精选作品展示，瀑布流布局呈现",
    icon: Layers,
    href: "/portfolio",
  },
  {
    name: "服务咨询",
    description: "提供Web开发、API设计等服务",
    icon: Zap,
    href: "/services",
  },
  {
    name: "技术栈",
    description: "熟悉的技术领域和工具链",
    icon: Cpu,
    href: "/about",
  },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-secondary opacity-75 blur animate-pulse" />
                <div className="relative rounded-full bg-background px-6 py-2">
                  <span className="text-sm font-semibold text-primary">
                    全栈开发者 & 技术博主
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              构建<span className="text-primary text-glow">数字化</span>体验
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              我是一个热爱技术的开发者，专注于构建高质量的Web应用和数字化解决方案。
              这里展示我的作品、技术文章和提供的服务。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/projects">
                  查看项目 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/about">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              网站功能
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              探索这个网站提供的各种功能和内容
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.name} className="gradient-border">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.name}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      了解更多 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                需要技术支持？
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                我提供专业的Web开发服务，包括网站开发、API设计、技术咨询等。
                无论是初创项目还是企业级应用，我都能帮你实现。
              </p>
              <div className="mt-6 flex max-w-md gap-x-4">
                <Button asChild>
                  <Link href="/services">查看服务</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/contact">联系我</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10 glass-card">
                  <Code className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-foreground">
                  现代技术栈
                </dt>
                <dd className="mt-2 leading-7 text-muted-foreground">
                  使用Next.js、FastAPI等现代技术构建高性能应用
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10 glass-card">
                  <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-foreground">
                  快速响应
                </dt>
                <dd className="mt-2 leading-7 text-muted-foreground">
                  注重用户体验，提供流畅的交互和加载速度
                </dd>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </section>
    </div>
  );
}
