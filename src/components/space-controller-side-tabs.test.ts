import { expect, it } from "vitest";

import {
  filterSidePanelSpecialItemsForContext,
  isDefaultExploreSideTab,
  resolveSidePanelTabsAfterOpen,
  resolveWorkspaceSidePanelContext,
} from "@/components/space-controller";

const ExploreIcon = () => null;
const GraphIcon = () => null;
const BacklinksIcon = () => null;
const ChatIcon = () => null;
const SearchIcon = () => null;
const RelatedIcon = () => null;

const specialItems = [
  { id: "graphView" as const, label: "Graph view", icon: GraphIcon },
  { id: "backlinks" as const, label: "Backlinks", icon: BacklinksIcon },
  { id: "objectsInside" as const, label: "Objects inside", icon: BacklinksIcon },
  { id: "relatedContent" as const, label: "Related content", icon: RelatedIcon },
  { id: "aiAssistantChat" as const, label: "AI chat", icon: ChatIcon },
  { id: "localSpaceQuery" as const, label: "Search", icon: SearchIcon },
];

it("treats the default Explore tab as the replaceable side-panel overview", () => {
  expect(isDefaultExploreSideTab({ id: "side-1", label: "Explore" })).toBe(true);
  expect(isDefaultExploreSideTab({ id: "graphView", label: "Graph view" })).toBe(false);
});

it("replaces the single default Explore side tab when opening another side item", () => {
  const nextTabs = resolveSidePanelTabsAfterOpen(
    [{ id: "side-1", label: "Explore", icon: ExploreIcon, draggable: true }],
    "side-1",
    { id: "graphView", label: "Graph view", icon: GraphIcon, draggable: true },
  );

  expect(nextTabs).toEqual([
    { id: "graphView", label: "Graph view", icon: GraphIcon, draggable: true },
  ]);
});

it("keeps existing side tabs when more than one tab is already open", () => {
  const nextTabs = resolveSidePanelTabsAfterOpen(
    [
      { id: "side-1", label: "Explore", icon: ExploreIcon, draggable: true },
      { id: "backlinks", label: "Backlinks", icon: BacklinksIcon, draggable: true },
    ],
    "side-1",
    { id: "graphView", label: "Graph view", icon: GraphIcon, draggable: true },
  );

  expect(nextTabs.map((tab) => tab.id)).toEqual(["side-1", "backlinks", "graphView"]);
});

it("selects an existing side tab without duplicating it", () => {
  const currentTabs = [
    { id: "side-1", label: "Explore", icon: ExploreIcon, draggable: true },
    { id: "graphView", label: "Graph view", icon: GraphIcon, draggable: true },
  ];

  expect(
    resolveSidePanelTabsAfterOpen(currentTabs, "side-1", {
      id: "graphView",
      label: "Graph view",
      icon: GraphIcon,
      draggable: true,
    }),
  ).toBe(currentTabs);
});

it("detects list, item, and collection contexts from the active workspace state", () => {
  const state = {
    collections: [{ id: "collection:reading" }],
    entities: [{ id: "entity:rebase" }],
    objectTypes: [{ id: "page" }, { id: "git" }],
  };

  expect(
    resolveWorkspaceSidePanelContext({
      ...state,
      activeEntityId: "git",
      mainValue: "git",
    }),
  ).toBe("list");

  expect(
    resolveWorkspaceSidePanelContext({
      ...state,
      activeEntityId: "entity:rebase",
      mainValue: "entity:rebase",
    }),
  ).toBe("item");

  expect(
    resolveWorkspaceSidePanelContext({
      ...state,
      activeEntityId: "collection:reading",
      mainValue: "object-type-item:collection:collection:reading",
    }),
  ).toBe("collection");
});

it("filters side-panel special entries by workspace context", () => {
  expect(
    filterSidePanelSpecialItemsForContext(specialItems, "list").map((item) => item.id),
  ).toEqual(["aiAssistantChat", "localSpaceQuery"]);

  expect(
    filterSidePanelSpecialItemsForContext(specialItems, "collection").map((item) => item.id),
  ).toEqual(["graphView", "aiAssistantChat", "localSpaceQuery"]);

  expect(
    filterSidePanelSpecialItemsForContext(specialItems, "item").map((item) => item.id),
  ).toEqual([
    "graphView",
    "backlinks",
    "objectsInside",
    "relatedContent",
    "aiAssistantChat",
    "localSpaceQuery",
  ]);
});
