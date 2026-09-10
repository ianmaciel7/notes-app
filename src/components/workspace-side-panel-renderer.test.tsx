import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import { WorkspaceSidePanelRenderer } from "@/components/workspace-side-panel-renderer";

it("renders Explore itself as one pending implementation", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceSidePanelRenderer
      activeMainObjectTitle="Git"
      activeTabLabel="Explore"
      sideValue="side-1"
    />,
  );

  expect(markup).toContain("Explore");
  expect(markup).toContain("Implementation pending");
  expect(markup.match(/Implementation pending/g)).toHaveLength(1);
  expect(markup).not.toContain("Graph view");
});

it("renders each selected Explore item as a PendingImplementation surface", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceSidePanelRenderer
      activeMainObjectTitle="Git"
      activeTabLabel="Graph view"
      sideValue="graphView"
    />,
  );

  expect(markup).toContain("Graph view");
  expect(markup).toContain("Implementation pending");
  expect(markup).toContain("Git");
});

it("uses the shared pending implementation appearance without a side-panel wrapper", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceSidePanelRenderer activeTabLabel="Explore" sideValue="side-1" />,
  );

  expect(markup.match(/data-slot="pending-implementation"/g)).toHaveLength(1);
  expect(markup).toContain('data-variant="workspace"');
  expect(markup).toContain('data-slot="pending-implementation-caption"');
  expect(markup).toContain("border-0 bg-transparent");
  expect(markup).not.toContain("bg-card p-4");
  expect(markup).not.toContain('data-slot="pending-implementation-card"');
  expect(markup).not.toContain("border border-dashed border-border bg-muted/20");
  expect(markup).not.toContain("border border-border bg-muted/25");
});
