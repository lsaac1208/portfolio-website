"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">出错了！</h2>
      <p className="text-muted-foreground">抱歉，发生了错误。请尝试刷新页面。</p>
      <Button onClick={() => reset()}>刷新页面</Button>
    </div>
  );
}
