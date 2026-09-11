import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const sourceRoot = `${process.cwd()}/src`;

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${sourceRoot}/`), "utf8");
}

it("keeps the desktop space switcher popup aligned with the captured Capacities menu", () => {
  const componentSource = readSource("app/_components/workspace/app-sidebar.tsx");

  expect(componentSource).toContain("spaceSwitcherContentClass");
  expect(componentSource).toContain("!w-[278px]");
  expect(componentSource).toContain("!min-w-[278px]");
  expect(componentSource).toContain("bg-[var(--app-bg-base)]");
  expect(componentSource).toContain("border-[var(--app-border-front)]");
  expect(componentSource).toContain("min-h-[52px]");

  const desktopContentSource = componentSource.slice(
    componentSource.indexOf("{!isMobile && ("),
    componentSource.indexOf("{isMobile && ("),
  );
  expect(desktopContentSource).not.toContain("{renderFooter()}");
});

it("keeps initial visual focus on the desktop space search field only", () => {
  const componentSource = readSource("app/_components/workspace/app-sidebar.tsx");

  expect(componentSource).toContain("initialFocus={searchInputRef}");
  expect(componentSource).toContain("autoHighlight={false}");

  const spaceItemSource = componentSource.slice(
    componentSource.indexOf("function renderSpaceItem"),
    componentSource.indexOf("function renderFooter"),
  );
  expect(spaceItemSource).not.toContain("data-[highlighted]:bg-[var(--app-bg-el)]");
  expect(spaceItemSource).toContain("data-highlighted:bg-transparent");
  expect(spaceItemSource).toContain("data-selected:bg-transparent");
});
