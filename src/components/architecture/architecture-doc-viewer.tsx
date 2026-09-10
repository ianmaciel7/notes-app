"use client";

import * as React from "react";

type ArchitectureDocBlock =
  | {
      depth: number;
      kind: "heading";
      text: string;
    }
  | {
      kind: "paragraph";
      text: string;
    }
  | {
      code: string;
      kind: "mermaid";
    };

export function parseArchitectureMarkdown(markdown: string): ArchitectureDocBlock[] {
  const blocks: ArchitectureDocBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let mermaid: string[] | null = null;

  function flushParagraph() {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ kind: "paragraph", text });
    paragraph = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (mermaid) {
      if (trimmed === "```") {
        blocks.push({ code: mermaid.join("\n").trim(), kind: "mermaid" });
        mermaid = null;
      } else {
        mermaid.push(line);
      }
      continue;
    }

    if (trimmed === "```mermaid") {
      flushParagraph();
      mermaid = [];
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      blocks.push({
        depth: headingMatch[1]?.length ?? 1,
        kind: "heading",
        text: headingMatch[2] ?? "",
      });
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const id = React.useId().replace(/:/g, "");

  React.useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          securityLevel: "strict",
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
        });
        const result = await mermaid.render(`architecture-diagram-${id}`, code);
        if (!cancelled) {
          setSvg(result.svg);
          setError(null);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Could not render Mermaid diagram.");
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  return (
    <figure
      className="overflow-auto rounded-lg border border-border bg-background p-4"
      data-architecture-mermaid
    >
      {svg ? (
        <object
          aria-label="Architecture diagram"
          className="h-auto max-w-full"
          data={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
          type="image/svg+xml"
        />
      ) : (
        <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{code}</pre>
      )}
      {error ? <figcaption className="mt-3 text-xs text-destructive">{error}</figcaption> : null}
    </figure>
  );
}

export function ArchitectureDocViewer({ markdown }: { markdown: string }) {
  const blocks = React.useMemo(() => parseArchitectureMarkdown(markdown), [markdown]);

  return (
    <article className="min-h-screen bg-card px-8 py-7 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        {blocks.map((block) => {
          const key =
            block.kind === "mermaid"
              ? `${block.kind}-${block.code}`
              : `${block.kind}-${block.text}`;

          if (block.kind === "heading") {
            const Heading = block.depth === 1 ? "h1" : block.depth === 2 ? "h2" : "h3";
            return (
              <Heading
                className={
                  block.depth === 1
                    ? "text-3xl font-semibold"
                    : "text-xl font-semibold text-foreground"
                }
                key={key}
              >
                {block.text}
              </Heading>
            );
          }

          if (block.kind === "mermaid") {
            return <MermaidDiagram code={block.code} key={key} />;
          }

          return (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground" key={key}>
              {block.text}
            </p>
          );
        })}
      </div>
    </article>
  );
}
