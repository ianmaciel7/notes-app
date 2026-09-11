import { expect, it } from "vitest";

import {
  createWorkspaceMainTabsStorageState,
  createWorkspaceRouteMainSegment,
  createWorkspaceRouteSpaceSegment,
  createWorkspaceUrlPath,
  filterSidePanelSpecialItemsForContext,
  isDefaultExploreSideTab,
  resolveSidePanelTabsAfterClose,
  resolveSidePanelTabsAfterOpen,
  resolveWorkspaceEntityTitle,
  resolveWorkspaceExploreActivation,
  resolveWorkspaceMainTabsFromStoredState,
  resolveWorkspaceMainValueFromRouteSegment,
  resolveWorkspaceSidePanelContext,
  shouldRenderWorkspaceHeaderTabs,
  upsertWorkspaceTab,
} from "@/app/_components/workspace/space-controller";

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

it("resets the side panel to Explore when the last side tab is closed", () => {
  expect(
    resolveSidePanelTabsAfterClose(
      [{ id: "localSpaceQuery", label: "Search", icon: SearchIcon, draggable: true }],
      "localSpaceQuery",
      { id: "localSpaceQuery", label: "Search", icon: SearchIcon, draggable: true },
      { id: "side-1", label: "Explore", icon: ExploreIcon, draggable: true },
    ),
  ).toEqual({
    tabs: [{ id: "side-1", label: "Explore", icon: ExploreIcon, draggable: true }],
    value: "side-1",
    closedLastTab: true,
  });
});

it("updates an existing restored tab when icon metadata loads later", () => {
  const nextTabs = upsertWorkspaceTab(
    [{ id: "entity-1", label: "Untitled aaa", draggable: true }],
    {
      id: "entity-1",
      label: "Untitled aaa",
      icon: GraphIcon,
      iconClassName: "text-blue-600",
      draggable: true,
    },
  );

  expect(nextTabs).toHaveLength(1);
  expect(nextTabs[0]?.icon).toBe(GraphIcon);
  expect(nextTabs[0]?.iconClassName).toBe("text-blue-600");
});

it("appends a restored tab that does not exist yet", () => {
  expect(
    upsertWorkspaceTab([{ id: "page", label: "Pages", icon: ExploreIcon, draggable: true }], {
      id: "entity-1",
      label: "Untitled aaa",
      icon: GraphIcon,
      draggable: true,
    }).map((tab) => tab.id),
  ).toEqual(["page", "entity-1"]);
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

it("opens Explore in the side panel without replacing the main workspace", () => {
  expect(resolveWorkspaceExploreActivation("page")).toEqual({
    activeAction: undefined,
    mainValue: "page",
    sideValue: "explore",
  });
});

it("creates a workspace URL from the active main and side tabs", () => {
  expect(
    createWorkspaceUrlPath({
      currentSearch: "?view=dense",
      mainValue: "entity-41a189bd-9309-4a6f-aa02-5e5aa1023ee2",
      spaceId: "personal",
    }),
  ).toBe("/996adc8d-8e17-463b-92de-1b11a58e9c64/41a189bd-9309-4a6f-aa02-5e5aa1023ee2?view=dense");
});

it("uses clean GUID-like route segments while preserving internal entity ids", () => {
  expect(createWorkspaceRouteSpaceSegment("personal")).toBe("996adc8d-8e17-463b-92de-1b11a58e9c64");
  expect(createWorkspaceRouteMainSegment("entity-41a189bd-9309-4a6f-aa02-5e5aa1023ee2")).toBe(
    "41a189bd-9309-4a6f-aa02-5e5aa1023ee2",
  );

  expect(
    resolveWorkspaceMainValueFromRouteSegment("41a189bd-9309-4a6f-aa02-5e5aa1023ee2", [
      { id: "entity-41a189bd-9309-4a6f-aa02-5e5aa1023ee2" },
    ]),
  ).toBe("entity-41a189bd-9309-4a6f-aa02-5e5aa1023ee2");
});

it("uses an exact typed title for create-from-query while preserving default untitled labels", () => {
  expect(resolveWorkspaceEntityTitle("Page")).toBe("Untitled Page");
  expect(resolveWorkspaceEntityTitle("Page", { title: "zzzzzzzzzz" })).toBe("zzzzzzzzzz");
  expect(resolveWorkspaceEntityTitle(undefined, { title: "  zzzzzzzzzz  " })).toBe("zzzzzzzzzz");
});

it("stores the open main tabs without resurrecting a closed route tab on refresh", () => {
  const storedState = createWorkspaceMainTabsStorageState({
    mainValue: "page",
    spaceId: "personal",
    tabs: [{ id: "page" }, { id: "page" }],
  });

  expect(storedState).toEqual({
    mainValue: "page",
    spaceId: "personal",
    tabIds: ["page"],
  });

  const restoredState = resolveWorkspaceMainTabsFromStoredState({
    createTab: (id) =>
      id === "page" ? { id, label: "Pages", icon: ExploreIcon, draggable: true } : null,
    defaultTabs: [{ id: "page", label: "Pages", icon: ExploreIcon, draggable: true }],
    routeMainValue: "entity-closed",
    storedState,
  });

  expect(restoredState).toEqual({
    mainValue: "page",
    tabs: [{ id: "page", label: "Pages", icon: ExploreIcon, draggable: true }],
  });
});

it("hides workspace header tabs until persisted route state is restored", () => {
  expect(shouldRenderWorkspaceHeaderTabs(false)).toBe(false);
  expect(shouldRenderWorkspaceHeaderTabs(true)).toBe(true);
});
