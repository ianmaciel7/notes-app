import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${sourceRoot}/`), "utf8");
}

it("keeps the add-object-type intro as a compact green Capacities callout", () => {
  const componentSource = readSource("components/app-sidebar-object-type-studio.tsx");
  const globalCss = readSource("app/globals.css");

  expect(componentSource).toContain('data-slot="app-sidebar-object-type-intro"');
  expect(componentSource).toContain("bg-[var(--app-block-bg-green)]");
  expect(componentSource).toContain("sm:w-[min(1128px,calc(100vw-4rem))]");
  expect(componentSource).toContain("px-3 py-2 text-[var(--app-block-text-green)]");
  expect(componentSource).toContain("size-8 rounded-base border-[0.5px] text-lg");
  expect(componentSource).toContain("max-w-[672px]");
  expect(componentSource).toContain("bg-[var(--app-bg-front)]");
  expect(globalCss).toContain("--app-block-bg-green:");
  expect(globalCss).toContain("--app-block-text-green:");
  expect(globalCss).toContain("--type-label-text-amber:");
  expect(globalCss).toContain("--type-label-bg-amber:");
  expect(globalCss).toContain("--type-label-border-amber:");
});

it("dismisses the object type details panel when the backing content is clicked", () => {
  const componentSource = readSource("components/app-sidebar-object-type-studio.tsx");

  expect(componentSource).toContain('data-slot="app-sidebar-object-type-details-dismiss-layer"');
  expect(componentSource).toContain("onClick={resetSelection}");
  expect(componentSource).toContain("right-[calc(28rem+1.25rem)]");
  expect(componentSource).toContain("z-10");
  expect(componentSource).toContain("detailsOpen &&");
});
