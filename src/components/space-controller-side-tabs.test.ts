import { expect, it } from "vitest";

import {
  isDefaultExploreSideTab,
  resolveSidePanelTabsAfterOpen,
} from "@/components/space-controller";

const ExploreIcon = () => null;
const GraphIcon = () => null;
const BacklinksIcon = () => null;

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
