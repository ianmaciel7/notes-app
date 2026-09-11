import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { objectEntityFixture } from "@/app/_components/objects/object-view-fixtures";
import { WorkspaceSidePanelRenderer } from "@/app/_components/workspace/workspace-side-panel-renderer";

const note = objectEntityFixture({ id: "note", title: "Real note" });
const source = objectEntityFixture({ id: "source", title: "Linked source" });
const relation = {
  id: "link",
  spaceId: "personal",
  sourceId: "source",
  targetId: "note",
  propertyId: "reference",
  createdAt: note.createdAt,
};
const context = {
  activeEntityId: "note",
  spaceId: "personal",
  entities: [note, source],
  relations: [relation],
};

it("shows an honest empty context instead of a fake or pending Explore screen", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceSidePanelRenderer activeTabLabel="Explore" sideValue="side-1" />,
  );
  expect(markup).toContain("Explore");
  expect(markup).toContain("Selecione um objeto");
  expect(markup).not.toContain("Implementation pending");
});

it("renders stored backlinks and excludes a foreign-space source with the same id", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceSidePanelRenderer
      {...context}
      entities={[
        ...context.entities,
        { ...source, spaceId: "other", title: "Private other space" },
      ]}
      activeTabLabel="Backlinks"
      sideValue="backlinks"
    />,
  );
  expect(markup).toContain("Linked source");
  expect(markup).not.toContain("Private other space");
  expect(markup).not.toContain("Implementation pending");
});

it("renders a graph with real nodes and edges and no invented connections", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceSidePanelRenderer {...context} activeTabLabel="Graph view" sideValue="graphView" />,
  );
  expect(markup).toContain("Real note");
  expect(markup).toContain("Linked source");
  expect(markup.match(/data-slot="graph-edge"/g)).toHaveLength(1);
});

it("searches saved workspace entities without requiring a selected object", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceSidePanelRenderer
      {...context}
      activeEntityId={undefined}
      activeTabLabel="Search"
      sideValue="localSpaceQuery"
    />,
  );
  expect(markup).toContain("Pesquisar neste espaço");
  expect(markup).toContain("Real note");
  expect(markup).toContain("Linked source");
});
