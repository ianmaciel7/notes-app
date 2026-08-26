"use client";

import type { ReactNode } from "react";

import {
  AtomicNotesWorkspace as WorkspaceContent,
  GraphWorkspace,
  ExploreWorkspace as WorkspaceExplore,
} from "@/components/workspace-content";
import { workspaceContentScopeClass } from "@/components/ui/workspace-surface";
import { useWorkspace } from "@/components/workspace-controller";

type WorkspaceContentSurfaceProps = {
  readonly children: ReactNode;
};

function WorkspaceContentSurface({ children }: WorkspaceContentSurfaceProps) {
  return (
    <div
      data-slot="workspace-content-surface"
      className={workspaceContentScopeClass}
    >
      {children}
    </div>
  );
}

function AtomicNotesWorkspace() {
  return (
    <WorkspaceContentSurface>
      <WorkspaceContent />
    </WorkspaceContentSurface>
  );
}

function ExploreWorkspace() {
  const { sideValue } = useWorkspace();
  return (
    <WorkspaceContentSurface>
      {sideValue === "graphView" ? <GraphWorkspace /> : <WorkspaceExplore />}
    </WorkspaceContentSurface>
  );
}

export { AtomicNotesWorkspace, ExploreWorkspace, WorkspaceContentSurface };
