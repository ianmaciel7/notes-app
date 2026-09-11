import type { Story, StoryDefault } from "@ladle/react";
import * as React from "react";

import { AppHeaderCircleDashedIcon, AppHeaderGraphIcon } from "@/components/app-header-icons";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

import { useWorkspace, WorkspaceProvider } from "./space-controller";
import { WorkspaceSidePanelContent } from "./workspace-side-panel-content";

export default {
  title: "Components / Side Panel / Content",
} satisfies StoryDefault;

type SidePanelStoryStateProps = {
  activeMainObjectTitle?: string;
  activeTabLabel: string;
  sideValue: string;
};

function SidePanelStoryState({
  activeMainObjectTitle,
  activeTabLabel,
  sideValue,
}: SidePanelStoryStateProps) {
  const { createWorkspaceEntity, setActiveEntityId, setMainValue, setSideTabs, setSideValue } =
    useWorkspace();

  React.useEffect(() => {
    setSideTabs([
      {
        draggable: true,
        icon: sideValue === "graphView" ? AppHeaderGraphIcon : AppHeaderCircleDashedIcon,
        id: sideValue,
        label: activeTabLabel,
      },
    ]);
    setSideValue(sideValue);

    if (!activeMainObjectTitle) {
      setActiveEntityId(null);
      return;
    }

    let cancelled = false;
    void createWorkspaceEntity("page", "Page", { title: activeMainObjectTitle }).then(
      (entity: SpaceEntityRecord | null) => {
        if (cancelled || !entity) return;
        setActiveEntityId(entity.id);
        setMainValue(entity.id);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [
    activeMainObjectTitle,
    activeTabLabel,
    createWorkspaceEntity,
    setActiveEntityId,
    setMainValue,
    setSideTabs,
    setSideValue,
    sideValue,
  ]);

  return null;
}

function SidePanelContentStoryFrame({
  activeMainObjectTitle,
  activeTabLabel,
  sideValue,
}: SidePanelStoryStateProps) {
  return (
    <WorkspaceProvider>
      <SidePanelStoryState
        activeMainObjectTitle={activeMainObjectTitle}
        activeTabLabel={activeTabLabel}
        sideValue={sideValue}
      />
      <div className="h-screen min-h-0 w-[344px] overflow-hidden border-l border-border bg-card">
        <WorkspaceSidePanelContent />
      </div>
    </WorkspaceProvider>
  );
}

export const ExploreOverview: Story = () => (
  <SidePanelContentStoryFrame activeTabLabel="Explore" sideValue="side-1" />
);

export const GraphViewForObject: Story = () => (
  <SidePanelContentStoryFrame
    activeMainObjectTitle="Research article"
    activeTabLabel="Graph view"
    sideValue="graphView"
  />
);

export const SearchForObject: Story = () => (
  <SidePanelContentStoryFrame
    activeMainObjectTitle="Research article"
    activeTabLabel="Search"
    sideValue="localSpaceQuery"
  />
);

ExploreOverview.storyName = "Explore";

GraphViewForObject.storyName = "Graph";

SearchForObject.storyName = "Search";
