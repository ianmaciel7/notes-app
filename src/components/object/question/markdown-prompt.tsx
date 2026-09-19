import type * as React from "react";
import { cn } from "@/lib/utils";

interface MarkdownPromptProps {
  prompt?: string;
  content?: string;
  className?: string;
}

export function MarkdownPrompt({
  prompt,
  content,
  className,
}: MarkdownPromptProps) {
  const text = prompt ?? content ?? "";
  if (!text.trim()) {
    return null;
  }

  // Split by code blocks ```...```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = codeBlockRegex.exec(text);

  while (match !== null) {
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore.trim()) {
      elements.push(
        <div key={`text-${lastIndex}`}>{renderTextBlocks(textBefore)}</div>,
      );
    }

    const language = match[1] || "";
    const codeContent = match[2];
    elements.push(
      <div
        key={`code-${match.index}`}
        className="my-3 overflow-hidden rounded-md border border-border bg-muted/60 text-foreground"
      >
        {language && (
          <div className="border-b border-border/60 bg-muted px-3 py-1 text-xs font-mono text-muted-foreground uppercase">
            {language}
          </div>
        )}
        <pre className="overflow-x-auto p-3 text-xs font-mono leading-relaxed">
          <code>{codeContent}</code>
        </pre>
      </div>,
    );

    lastIndex = match.index + match[0].length;
    match = codeBlockRegex.exec(text);
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText.trim()) {
    elements.push(
      <div key={`text-end-${lastIndex}`}>
        {renderTextBlocks(remainingText)}
      </div>,
    );
  }

  return (
    <div
      className={cn(
        "space-y-3 text-sm leading-relaxed text-foreground md:text-base",
        className,
      )}
    >
      {elements}
    </div>
  );
}

function renderTextBlocks(rawText: string): React.ReactNode {
  const paragraphs = rawText.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n");
        const isBulletList = lines.every(
          (line) =>
            line.trim().startsWith("- ") ||
            line.trim().startsWith("* ") ||
            line.trim() === "",
        );
        const isNumberedList = lines.every(
          (line) => /^\d+\.\s/.test(line.trim()) || line.trim() === "",
        );

        if (isBulletList && lines.some((l) => l.trim().length > 0)) {
          return (
            <ul
              key={`ul-${pIdx}-${lines[0]?.slice(0, 10)}`}
              className="my-2 list-disc space-y-1.5 pl-6"
            >
              {lines
                .filter((l) => l.trim().length > 0)
                .map((line) => {
                  const cleaned = line.trim().replace(/^[-*]\s+/, "");
                  return (
                    <li key={`li-${pIdx}-${cleaned}`}>
                      {renderInlineFormatting(cleaned)}
                    </li>
                  );
                })}
            </ul>
          );
        }

        if (isNumberedList && lines.some((l) => l.trim().length > 0)) {
          return (
            <ol
              key={`ol-${pIdx}-${lines[0]?.slice(0, 10)}`}
              className="my-2 list-decimal space-y-1.5 pl-6"
            >
              {lines
                .filter((l) => l.trim().length > 0)
                .map((line) => {
                  const cleaned = line.trim().replace(/^\d+\.\s+/, "");
                  return (
                    <li key={`ol-li-${pIdx}-${cleaned}`}>
                      {renderInlineFormatting(cleaned)}
                    </li>
                  );
                })}
            </ol>
          );
        }

        return (
          <p key={`p-${pIdx}-${para.slice(0, 10)}`} className="my-1.5">
            {renderInlineFormatting(para)}
          </p>
        );
      })}
    </>
  );
}

function renderInlineFormatting(line: string): React.ReactNode {
  // Simple regex parser for inline code `...` and bold **...**
  const parts: React.ReactNode[] = [];
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIdx = 0;
  let tokenMatch: RegExpExecArray | null = tokenRegex.exec(line);

  while (tokenMatch !== null) {
    if (tokenMatch.index > lastIdx) {
      parts.push(line.substring(lastIdx, tokenMatch.index));
    }

    const matchText = tokenMatch[0];
    if (matchText.startsWith("`") && matchText.endsWith("`")) {
      parts.push(
        <code
          key={`inline-code-${tokenMatch.index}`}
          className="rounded border border-border/80 bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground"
        >
          {matchText.slice(1, -1)}
        </code>,
      );
    } else if (matchText.startsWith("**") && matchText.endsWith("**")) {
      parts.push(
        <strong
          key={`inline-bold-${tokenMatch.index}`}
          className="font-semibold text-foreground"
        >
          {matchText.slice(2, -2)}
        </strong>,
      );
    }

    lastIdx = tokenMatch.index + matchText.length;
    tokenMatch = tokenRegex.exec(line);
  }

  if (lastIdx < line.length) {
    parts.push(line.substring(lastIdx));
  }

  return parts.length > 0 ? parts : line;
}
