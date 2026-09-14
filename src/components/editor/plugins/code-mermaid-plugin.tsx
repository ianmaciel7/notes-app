"use client";

import { Code, Workflow } from "lucide-react";
import { createPlatePlugin } from "platejs/react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const KEY_CODE_BLOCK_MERMAID = "codeBlockMermaid";

export interface CodeBlockMermaidElementProps extends React.ComponentPropsWithoutRef<"div"> {
  attributes?: Record<string, unknown>;
  element: {
    id?: string;
    language?: string;
    renderMode?: "source" | "mermaid";
  };
}

export function CodeBlockMermaidElement({
  className,
  element,
  attributes,
  children,
  ...props
}: CodeBlockMermaidElementProps) {
  const { language = "typescript", renderMode = "source" } = element;
  const isMermaid = language === "mermaid" || renderMode === "mermaid";

  return (
    <div
      data-slot="editor-code-block"
      {...attributes}
      {...props}
      className={cn(
        "my-4 rounded-xl border border-border bg-muted/40 font-mono text-sm shadow-xs overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium">
          {isMermaid ? <Workflow aria-hidden="true" className="size-3.5 text-brand" /> : <Code aria-hidden="true" className="size-3.5" />}
          <span className="uppercase">{language}</span>
        </div>
      </div>
      <div className="p-4 font-mono text-xs overflow-x-auto text-foreground">{children}</div>
    </div>
  );
}

export const CodeBlockMermaidPlugin = createPlatePlugin({
  key: KEY_CODE_BLOCK_MERMAID,
  node: {
    component: CodeBlockMermaidElement,
    isElement: true,
  },
});
