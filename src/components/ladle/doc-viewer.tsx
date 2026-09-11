"use client";

import { useLadleContext } from "@ladle/react";
import * as React from "react";

type DocBlock =
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

export function parseDocMarkdown(markdown: string): DocBlock[] {
  const blocks: DocBlock[] = [];
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

// Retain alias for backwards compatibility
export const parseArchitectureMarkdown = parseDocMarkdown;

function detectDarkModeFromDom(): boolean {
  if (typeof document === "undefined") return false;

  const html = document.documentElement;
  const body = document.body;

  const isDark =
    html.classList.contains("dark") ||
    html.classList.contains("ladle-dark") ||
    html.getAttribute("data-theme") === "dark" ||
    body?.classList.contains("dark") ||
    body?.classList.contains("ladle-dark") ||
    body?.getAttribute("data-theme") === "dark" ||
    Boolean(document.querySelector(".dark, .ladle-dark, [data-theme='dark']"));

  if (isDark) return true;

  const isLight =
    html.classList.contains("light") ||
    html.classList.contains("ladle-light") ||
    html.getAttribute("data-theme") === "light" ||
    body?.classList.contains("light") ||
    body?.classList.contains("ladle-light") ||
    body?.getAttribute("data-theme") === "light";

  if (isLight) return false;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function useDarkMode(): boolean {
  const ladleContext = useLadleContext();
  const ladleTheme = ladleContext?.globalState?.theme;

  const [domIsDark, setDomIsDark] = React.useState<boolean>(detectDarkModeFromDom);

  React.useEffect(() => {
    const update = () => {
      setDomIsDark(detectDarkModeFromDom());
    };

    update();

    const observer = new MutationObserver(update);
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributeFilter: ["class", "data-theme", "theme", "style"],
        attributes: true,
      });
      if (document.body) {
        observer.observe(document.body, {
          attributeFilter: ["class", "data-theme", "theme", "style"],
          attributes: true,
        });
      }
    }

    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    mediaQuery?.addEventListener?.("change", update);

    return () => {
      observer.disconnect();
      mediaQuery?.removeEventListener?.("change", update);
    };
  }, []);

  if (ladleTheme === "dark") return true;
  if (ladleTheme === "light") return false;
  return domIsDark;
}

async function renderMermaidSvg(id: string, code: string, isDark: boolean): Promise<string> {
  const mermaid = (await import("mermaid")).default;
  mermaid.initialize({
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    securityLevel: "strict",
    startOnLoad: false,
    theme: isDark ? "dark" : "default",
    themeVariables: isDark
      ? {
          actorBkg: "oklch(0.269 0 0)",
          actorBorder: "oklch(0.439 0 0)",
          actorLineColor: "oklch(0.708 0 0)",
          actorTextColor: "oklch(0.985 0 0)",
          background: "transparent",
          clusterBkg: "oklch(0.205 0 0)",
          clusterBorder: "oklch(0.371 0 0)",
          darkMode: true,
          defaultLinkColor: "oklch(0.708 0 0)",
          edgeLabelBackground: "oklch(0.205 0 0)",
          labelBoxBkgColor: "oklch(0.269 0 0)",
          labelBoxBorderColor: "oklch(0.439 0 0)",
          labelTextColor: "oklch(0.985 0 0)",
          lineColor: "oklch(0.708 0 0)",
          loopTextColor: "oklch(0.985 0 0)",
          nodeBorder: "oklch(0.439 0 0)",
          noteBkgColor: "oklch(0.269 0 0)",
          noteTextColor: "oklch(0.985 0 0)",
          primaryBorderColor: "oklch(0.439 0 0)",
          primaryColor: "oklch(0.269 0 0)",
          primaryTextColor: "oklch(0.985 0 0)",
          secondaryColor: "oklch(0.205 0 0)",
          signalColor: "oklch(0.708 0 0)",
          signalTextColor: "oklch(0.985 0 0)",
          tertiaryColor: "oklch(0.269 0 0)",
          titleColor: "oklch(0.985 0 0)",
        }
      : {
          actorBkg: "oklch(0.97 0 0)",
          actorBorder: "oklch(0.87 0 0)",
          actorLineColor: "oklch(0.439 0 0)",
          actorTextColor: "oklch(0.145 0 0)",
          background: "transparent",
          clusterBkg: "oklch(0.985 0 0)",
          clusterBorder: "oklch(0.87 0 0)",
          darkMode: false,
          defaultLinkColor: "oklch(0.439 0 0)",
          edgeLabelBackground: "oklch(1 0 0)",
          labelBoxBkgColor: "oklch(0.97 0 0)",
          labelBoxBorderColor: "oklch(0.87 0 0)",
          labelTextColor: "oklch(0.145 0 0)",
          lineColor: "oklch(0.439 0 0)",
          loopTextColor: "oklch(0.145 0 0)",
          nodeBorder: "oklch(0.87 0 0)",
          noteBkgColor: "oklch(0.97 0 0)",
          noteTextColor: "oklch(0.145 0 0)",
          primaryBorderColor: "oklch(0.87 0 0)",
          primaryColor: "oklch(0.97 0 0)",
          primaryTextColor: "oklch(0.145 0 0)",
          secondaryColor: "oklch(0.985 0 0)",
          signalColor: "oklch(0.439 0 0)",
          signalTextColor: "oklch(0.145 0 0)",
          tertiaryColor: "oklch(0.97 0 0)",
          titleColor: "oklch(0.145 0 0)",
        },
  });
  const renderId = `doc-diagram-${id}-${Math.random().toString(36).substring(2, 7)}`;
  const result = await mermaid.render(renderId, code);
  return result.svg;
}

function MermaidDiagram({ code }: { code: string }) {
  const isDark = useDarkMode();
  const [svg, setSvg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const id = React.useId().replace(/:/g, "");

  React.useEffect(() => {
    let cancelled = false;

    renderMermaidSvg(id, code, isDark)
      .then((renderedSvg) => {
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Could not render Mermaid diagram.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, id, isDark]);

  return (
    <figure
      className="overflow-auto rounded-lg border border-border bg-card p-4 transition-colors"
      data-ladle-mermaid
    >
      {svg ? (
        <div
          aria-label="Documentation diagram"
          className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized SVG from mermaid renderer
          dangerouslySetInnerHTML={{ __html: svg }}
          role="img"
        />
      ) : (
        <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{code}</pre>
      )}
      {error ? <figcaption className="mt-3 text-xs text-destructive">{error}</figcaption> : null}
    </figure>
  );
}

function HeadingBlock({ depth, text }: { depth: number; text: string }) {
  const Heading = depth === 1 ? "h1" : depth === 2 ? "h2" : "h3";
  const className =
    depth === 1 ? "text-3xl font-semibold" : "text-xl font-semibold text-foreground";
  return <Heading className={className}>{text}</Heading>;
}

function DocBlockItem({ block }: { block: DocBlock }) {
  if (block.kind === "heading") {
    return <HeadingBlock depth={block.depth} text={block.text} />;
  }

  if (block.kind === "mermaid") {
    return <MermaidDiagram code={block.code} />;
  }

  return <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{block.text}</p>;
}

export function DocViewer({ markdown }: { markdown: string }) {
  const blocks = React.useMemo(() => parseDocMarkdown(markdown), [markdown]);

  return (
    <article className="min-h-screen bg-card px-8 py-7 text-foreground font-sans">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        {blocks.map((block) => {
          const key =
            block.kind === "mermaid"
              ? `${block.kind}-${block.code}`
              : `${block.kind}-${block.text}`;

          return <DocBlockItem block={block} key={key} />;
        })}
      </div>
    </article>
  );
}

// Alias for backwards compatibility
export const ArchitectureDocViewer = DocViewer;
