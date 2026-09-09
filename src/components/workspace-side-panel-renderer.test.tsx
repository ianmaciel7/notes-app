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
