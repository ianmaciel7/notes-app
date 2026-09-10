"use client";

import { useWorkspace } from "@/components/space-controller";
import { WorkspaceSidePanelRenderer } from "@/components/workspace-side-panel-renderer";

type WorkspaceTabLike = {
  id: string;
  label?: string;
};

export function getWorkspaceSidePanelPendingName(
  tabs: WorkspaceTabLike[] | undefined,
  value: string | undefined,
  fallback: string,
) {
  return tabs?.find((tab) => tab.id === value)?.label ?? fallback;
}

export function WorkspaceSidePanelContent() {
  const { activeEntityId, createdEntities, sideTabs, sideValue } = useWorkspace();
  const name = getWorkspaceSidePanelPendingName(sideTabs, sideValue, "Side panel");
  const activeEntity = createdEntities.find(
    (entity: { id: string }) => entity.id === activeEntityId,
  );

  return (
    <WorkspaceSidePanelRenderer
      activeMainObjectTitle={activeEntity?.title}
      activeTabLabel={name}
      sideValue={sideValue}
    />
  );
}
