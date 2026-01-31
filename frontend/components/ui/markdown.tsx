"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // 简单的 Markdown 解析
  const renderMarkdown = (text: string): React.ReactNode => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLanguage = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 代码块开始/结束
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim() || "text";
          codeContent = "";
        } else {
          inCodeBlock = false;
          elements.push(
            <pre key={i} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
              <code className={`language-${codeLanguage} text-sm`}>{codeContent}</code>
            </pre>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        continue;
      }

      // 标题
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
            {line.slice(4)}
          </h3>
        );
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
            {line.slice(3)}
          </h2>
        );
        continue;
      }
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold mt-8 mb-4">
            {line.slice(2)}
          </h1>
        );
        continue;
      }

      // 粗体
      if (line.includes("**")) {
        const parts = line.split("**");
        elements.push(
          <p key={i} className="my-2">
            {parts.map((part, idx) =>
              idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
            )}
          </p>
        );
        continue;
      }

      // 列表
      if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={i} className="ml-4 my-1">
            {line.slice(2)}
          </li>
        );
        continue;
      }

      // 有序列表
      if (/^\d+\. /.test(line)) {
        elements.push(
          <li key={i} className="ml-4 my-1 list-decimal">
            {line.replace(/^\d+\. /, "")}
          </li>
        );
        continue;
      }

      // 链接
      const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        elements.push(
          <p key={i} className="my-2">
            <a
              href={linkMatch[2]}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkMatch[1]}
            </a>
          </p>
        );
        continue;
      }

      // 分割线
      if (line.startsWith("---")) {
        elements.push(<hr key={i} className="my-6 border-border" />);
        continue;
      }

      // 空行
      if (line.trim() === "") {
        elements.push(<div key={i} className="h-4" />);
        continue;
      }

      // 普通段落
      elements.push(<p key={i} className="my-2">{line}</p>);
    }

    return elements;
  };

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
}
