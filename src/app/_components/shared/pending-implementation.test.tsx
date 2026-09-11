import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import { PendingImplementation } from "@/app/_components/shared/pending-implementation";

const projectRoot = process.cwd();

function readProjectSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${projectRoot}/`), "utf8");
}

it("renders the pending component name passed by props", () => {
  const markup = renderToStaticMarkup(
    <PendingImplementation
      area="Side panel"
      description="Replace the old inspector placeholder."
      name="Object inspector"
    />,
  );

  expect(markup).toContain("Object inspector");
  expect(markup).toContain("Implementation pending");
  expect(markup).toContain("Side panel");
  expect(markup).toContain("Replace the old inspector placeholder.");
  expect(markup).toContain('data-variant="default"');
  expect(markup).toContain("border border-border bg-muted/25");
});

it("can render a workspace pending surface with a quiet caption treatment", () => {
  const markup = renderToStaticMarkup(
    <PendingImplementation
      area="Main panel"
      description="This workspace route is pending."
      name="Pages"
      variant="workspace"
    />,
  );

  expect(markup).toContain('data-variant="workspace"');
  expect(markup).toContain("border-0 bg-transparent");
  expect(markup).toContain('data-slot="pending-implementation-caption"');
  expect(markup).toContain("text-[var(--app-text-subtle)]");
  expect(markup).toContain("italic");
  expect(markup).not.toContain('data-slot="pending-implementation-card"');
  expect(markup).not.toContain("border border-dashed border-border bg-muted/20");
  expect(markup).not.toContain("border border-border bg-muted/25");
});

it("has Ladle stories for pending implementation panel states", () => {
  const storySource = readProjectSource(
    "src/app/_components/shared/pending-implementation.stories.tsx",
  );

  expect(storySource).toContain("PendingImplementation");
  expect(storySource).toContain("MainPanelPages");
  expect(storySource).toContain("SidePanelExplore");
  expect(storySource).toContain("Páginas should be implemented here.");
  expect(storySource).toContain("Explore should be implemented here.");
});
