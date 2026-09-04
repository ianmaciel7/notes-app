import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

test("active control hints never use native title tooltips", () => {
  const sources = [
    "src/components/app-header-tabs.tsx",
    "src/components/app-sidebar-floating-nav.tsx",
    "src/components/ui/sidebar.tsx",
  ];

  for (const source of sources) {
    const text = read(source);
    expect(text, source).not.toMatch(/\btitle=(?:\{|\")/);
  }
});

test("space switcher uses a standard tooltip instead of a HoverCard timer", () => {
  const source = read("src/components/app-sidebar.tsx");

  expect(source).not.toContain("hintTimerRef");
  expect(source).not.toContain("hintOpen");
  expect(source).not.toContain("scheduleHint");
  expect(source).not.toContain("<HoverCard");
  expect(source).toContain("tooltip={{ text: text.changeSpace, side: \"right\" }}");
});

test("tab actions use explicit tooltips and tab previews delegate timing to PreviewCard", () => {
  const source = read("src/components/app-header-tabs.tsx");

  expect(source).not.toContain("TAB_PREVIEW_DELAY");
  expect(source).not.toContain("previewTimerRef");
  expect(source).not.toContain("setPreviewOpen");
  expect(source).toContain("tooltip={{ text: label, side: \"bottom\" }}");
  expect(source).toContain("<HoverCard>");
  expect(source).toContain("<HoverCardTrigger");
});

test("side-panel and shell icon controls use the shared explicit tooltip contract", () => {
  const sidePanel = read("src/components/app-side-panel-header.tsx");
  const shell = read("src/components/app-shell.tsx");

  expect(sidePanel).not.toContain("TooltipContent side={placement}");
  expect(sidePanel).toContain("tooltip={{ text: label, side: placement }}");
  expect(shell).toContain("tooltip={{");
});

test("help and footer hints use the shared tooltip contract instead of native or local wrappers", () => {
  const source = read("src/components/app-sidebar-floating-nav.tsx");

  expect(source).not.toContain("title={tooltip}");
  expect(source).not.toContain("function AppSidebarFooterTooltip");
  expect(source).toContain("tooltip={tooltip ? { text: tooltip, side: \"right\" } : undefined}");
  expect(source).toContain("tooltip={{ text: label, side: \"top\" }}");
});
