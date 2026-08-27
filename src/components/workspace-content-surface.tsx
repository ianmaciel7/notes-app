"use client";

import type { ReactNode } from "react";

import {
  AtomicNotesWorkspace as WorkspaceContent,
  ContextualPanelWorkspace,
} from "@/components/workspace-content";
import { workspaceContentScopeClass } from "@/components/ui/workspace-surface";

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
  return (
    <WorkspaceContentSurface>
      <ContextualPanelWorkspace />
    </WorkspaceContentSurface>
  );
}

export { AtomicNotesWorkspace, ExploreWorkspace, WorkspaceContentSurface };
