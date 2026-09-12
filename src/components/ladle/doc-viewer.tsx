"use client";

import { useLadleContext } from "@ladle/react";
import * as React from "react";

export type DocBlock =
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
    }
  | {
      code: string;
      kind: "code";
      language: string;
    }
  | {
      kind: "hr";
    }
  | {
      items: string[];
      kind: "list";
      ordered: boolean;
    }
  | {
      headers: string[];
      kind: "table";
      rows: string[][];
    };

function tryParseTableLine(trimmed: string): { isDelimiter: boolean; cells: string[] } | null {
  if (!(trimmed.startsWith("|") && trimmed.endsWith("|"))) return null;
  const cells = trimmed
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  const isDelimiter = cells.every((cell) => /^[-:\s]+$/.test(cell));
  return { cells, isDelimiter };
}

function tryParseHeading(trimmed: string): { depth: number; text: string } | null {
  const match = /^(#{1,6})\s+(.+)$/.exec(trimmed);
  if (!match) return null;
  return {
    depth: match[1]?.length ?? 1,
    text: match[2] ?? "",
  };
}

function tryParseList(trimmed: string): { isOrdered: boolean; text: string } | null {
  const unorderedMatch = /^[-*+]\s+(.+)$/.exec(trimmed);
  if (unorderedMatch) return { isOrdered: false, text: unorderedMatch[1] ?? "" };
  const orderedMatch = /^\d+\.\s+(.+)$/.exec(trimmed);
  if (orderedMatch) return { isOrdered: true, text: orderedMatch[1] ?? "" };
  return null;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: sequential line scanner
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: sequential line scanner
export function parseDocMarkdown(markdown: string): DocBlock[] {
  const blocks: DocBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let paragraph: string[] = [];
  let codeBlock: { code: string[]; language: string; isMermaid: boolean } | null = null;
  let currentTable: { headers: string[]; rows: string[][] } | null = null;
  let currentList: { items: string[]; ordered: boolean } | null = null;

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ kind: "paragraph", text });
    paragraph = [];
  };

  const flushTable = () => {
    if (currentTable) {
      if (currentTable.headers.length > 0 || currentTable.rows.length > 0) {
        blocks.push({
          headers: currentTable.headers,
          kind: "table",
          rows: currentTable.rows,
        });
      }
      currentTable = null;
    }
  };

  const flushList = () => {
    if (currentList) {
      if (currentList.items.length > 0) {
        blocks.push({
          items: currentList.items,
          kind: "list",
          ordered: currentList.ordered,
        });
      }
      currentList = null;
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushTable();
    flushList();
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (codeBlock) {
      if (trimmed === "```") {
        const codeText = codeBlock.code.join("\n");
        if (codeBlock.isMermaid) {
          blocks.push({ code: codeText.trim(), kind: "mermaid" });
        } else {
          blocks.push({
            code: codeText,
            kind: "code",
            language: codeBlock.language,
          });
        }
        codeBlock = null;
      } else {
        codeBlock.code.push(rawLine);
      }
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushAll();
      const lang = trimmed.slice(3).trim();
      codeBlock = { code: [], isMermaid: lang === "mermaid", language: lang };
      continue;
    }

    const tableLine = tryParseTableLine(trimmed);
    if (tableLine) {
      flushParagraph();
      flushList();
      if (!tableLine.isDelimiter) {
        if (!currentTable) {
          currentTable = { headers: tableLine.cells, rows: [] };
        } else {
          currentTable.rows.push(tableLine.cells);
        }
      }
      continue;
    }
    if (currentTable) flushTable();

    if (/^(---|[*]{3,}|_{3,})$/.test(trimmed)) {
      flushAll();
      blocks.push({ kind: "hr" });
      continue;
    }

    const heading = tryParseHeading(trimmed);
    if (heading) {
      flushAll();
      blocks.push({ depth: heading.depth, kind: "heading", text: heading.text });
      continue;
    }

    const listItem = tryParseList(trimmed);
    if (listItem) {
      flushParagraph();
      if (!currentList || currentList.ordered !== listItem.isOrdered) {
        flushList();
        currentList = { items: [listItem.text], ordered: listItem.isOrdered };
      } else {
        currentList.items.push(listItem.text);
      }
      continue;
    }
    if (currentList) flushList();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    paragraph.push(trimmed);
  }

  flushAll();
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
          actorBkg: "#27272a",
          actorBorder: "#52525b",
          actorLineColor: "#a1a1aa",
          actorTextColor: "#fafafa",
          background: "transparent",
          clusterBkg: "#18181b",
          clusterBorder: "#3f3f46",
          darkMode: true,
          defaultLinkColor: "#a1a1aa",
          edgeLabelBackground: "#18181b",
          labelBoxBkgColor: "#27272a",
          labelBoxBorderColor: "#52525b",
          labelTextColor: "#fafafa",
          lineColor: "#a1a1aa",
          loopTextColor: "#fafafa",
          nodeBorder: "#52525b",
          noteBkgColor: "#27272a",
          noteTextColor: "#fafafa",
          primaryBorderColor: "#52525b",
          primaryColor: "#27272a",
          primaryTextColor: "#fafafa",
          secondaryColor: "#18181b",
          signalColor: "#a1a1aa",
          signalTextColor: "#fafafa",
          tertiaryColor: "#27272a",
          titleColor: "#fafafa",
        }
      : {
          actorBkg: "#f4f4f5",
          actorBorder: "#e4e4e7",
          actorLineColor: "#71717a",
          actorTextColor: "#09090b",
          background: "transparent",
          clusterBkg: "#fafafa",
          clusterBorder: "#e4e4e7",
          darkMode: false,
          defaultLinkColor: "#71717a",
          edgeLabelBackground: "#ffffff",
          labelBoxBkgColor: "#f4f4f5",
          labelBoxBorderColor: "#e4e4e7",
          labelTextColor: "#09090b",
          lineColor: "#71717a",
          loopTextColor: "#09090b",
          nodeBorder: "#e4e4e7",
          noteBkgColor: "#f4f4f5",
          noteTextColor: "#09090b",
          primaryBorderColor: "#e4e4e7",
          primaryColor: "#f4f4f5",
          primaryTextColor: "#09090b",
          secondaryColor: "#fafafa",
          signalColor: "#71717a",
          signalTextColor: "#09090b",
          tertiaryColor: "#f4f4f5",
          titleColor: "#09090b",
        },
  });
  const renderId = `doc-diagram-${id}-${Math.random().toString(36).substring(2, 7)}`;
  const result = await mermaid.render(renderId, code);
  return result.svg;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: token matching matcher
function InlineMarkdown({ text }: { text: string }): React.ReactNode {
  if (!text) return null;

  const tokenRegex =
    /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*|__[^_]+__)|(\*[^*]+\*|_[^_]+_)/g;
  const matches = Array.from(text.matchAll(tokenRegex));

  if (matches.length === 0) return text;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      nodes.push(text.substring(lastIndex, matchIndex));
    }

    const [fullMatch, codeMatch, linkMatch, boldMatch, italicMatch] = match;

    if (codeMatch) {
      nodes.push(
        <code
          key={`code-${matchIndex}`}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground"
        >
          {codeMatch.slice(1, -1)}
        </code>,
      );
    } else if (linkMatch) {
      const linkExec = /\[([^\]]+)\]\(([^)]+)\)/.exec(linkMatch);
      if (linkExec) {
        const linkText = linkExec[1] ?? "";
        const linkUrl = linkExec[2] ?? "";
        nodes.push(
          <a
            key={`link-${matchIndex}`}
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
            href={linkUrl}
            rel="noopener noreferrer"
            target={linkUrl.startsWith("http") ? "_blank" : undefined}
          >
            <InlineMarkdown text={linkText} />
          </a>,
        );
      } else {
        nodes.push(linkMatch);
      }
    } else if (boldMatch) {
      const boldContent = boldMatch.slice(2, -2);
      nodes.push(
        <strong key={`bold-${matchIndex}`} className="font-semibold text-foreground">
          <InlineMarkdown text={boldContent} />
        </strong>,
      );
    } else if (italicMatch) {
      const italicContent = italicMatch.slice(1, -1);
      nodes.push(
        <em key={`italic-${matchIndex}`} className="italic">
          <InlineMarkdown text={italicContent} />
        </em>,
      );
    } else {
      nodes.push(fullMatch);
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return <>{nodes}</>;
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
      className="my-4 overflow-auto rounded-lg border border-border bg-card p-4 transition-colors"
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
        <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">{code}</pre>
      )}
      {error ? <figcaption className="mt-3 text-xs text-destructive">{error}</figcaption> : null}
    </figure>
  );
}

function HeadingBlock({ depth, text }: { depth: number; text: string }) {
  const Heading = depth === 1 ? "h1" : depth === 2 ? "h2" : depth === 3 ? "h3" : "h4";
  const className =
    depth === 1
      ? "text-3xl font-semibold tracking-tight text-foreground mt-6 mb-2"
      : depth === 2
        ? "text-xl font-semibold tracking-tight text-foreground mt-5 mb-2 border-b border-border pb-2"
        : depth === 3
          ? "text-lg font-semibold tracking-tight text-foreground mt-4 mb-1"
          : "text-base font-semibold tracking-tight text-foreground mt-3 mb-1";

  return (
    <Heading className={className}>
      <InlineMarkdown text={text} />
    </Heading>
  );
}

function CodeBlockItem({ code, language }: { code: string; language: string }) {
  return (
    <div className="my-3 overflow-hidden rounded-lg border border-border bg-muted/60">
      {language ? (
        <div className="border-b border-border bg-muted/80 px-4 py-1.5 font-mono text-[11px] font-medium uppercase text-muted-foreground">
          {language}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 whitespace-pre font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TableBlockItem({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-left text-sm">
        {headers.length > 0 ? (
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {headers.map((header, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: header position key
                <th key={`head-${idx}-${header}`} className="p-3 font-semibold text-foreground">
                  <InlineMarkdown text={header} />
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              // biome-ignore lint/suspicious/noArrayIndexKey: row position key
              key={`row-${rIdx}`}
              className="border-b border-border last:border-0 hover:bg-muted/20"
            >
              {row.map((cell, cIdx) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: cell position key
                  key={`cell-${rIdx}-${cIdx}`}
                  className="p-3 text-muted-foreground"
                >
                  <InlineMarkdown text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListBlockItem({ items, ordered }: { items: string[]; ordered: boolean }) {
  const ListTag = ordered ? "ol" : "ul";
  const listClass = ordered
    ? "my-2 ml-6 list-decimal space-y-1 text-sm text-muted-foreground"
    : "my-2 ml-6 list-disc space-y-1 text-sm text-muted-foreground";

  return (
    <ListTag className={listClass}>
      {items.map((item, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: list item index key
        <li key={`item-${idx}-${item.slice(0, 10)}`} className="leading-6">
          <InlineMarkdown text={item} />
        </li>
      ))}
    </ListTag>
  );
}

function DocBlockItem({ block }: { block: DocBlock }) {
  if (block.kind === "heading") {
    return <HeadingBlock depth={block.depth} text={block.text} />;
  }

  if (block.kind === "mermaid") {
    return <MermaidDiagram code={block.code} />;
  }

  if (block.kind === "code") {
    return <CodeBlockItem code={block.code} language={block.language} />;
  }

  if (block.kind === "table") {
    return <TableBlockItem headers={block.headers} rows={block.rows} />;
  }

  if (block.kind === "list") {
    return <ListBlockItem items={block.items} ordered={block.ordered} />;
  }

  if (block.kind === "hr") {
    return <hr className="my-6 border-border" />;
  }

  return (
    <p className="my-1 max-w-3xl text-sm leading-6 text-muted-foreground">
      <InlineMarkdown text={block.text} />
    </p>
  );
}

export function DocViewer({ markdown }: { markdown: string }) {
  const blocks = React.useMemo(() => parseDocMarkdown(markdown), [markdown]);

  return (
    <article className="min-h-screen bg-card px-8 py-7 font-sans text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        {blocks.map((block, index) => {
          const key = `doc-block-${index}-${block.kind}`;
          return <DocBlockItem block={block} key={key} />;
        })}
      </div>
    </article>
  );
}

// Alias for backwards compatibility
export const ArchitectureDocViewer = DocViewer;
