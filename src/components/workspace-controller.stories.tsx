import type { Story } from "@ladle/react";

import {
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
} from "./workspace-controller";

export const MainHeaderInWorkspace: Story = () => (
  <WorkspaceProvider>
    <div className="w-full overflow-hidden rounded-lg border bg-background">
      <WorkspaceMainHeader />
    </div>
  </WorkspaceProvider>
);

export const SidePanelHeaderInWorkspace: Story = () => (
  <WorkspaceProvider>
    <div className="w-80 overflow-hidden rounded-lg border bg-background">
      <WorkspaceSidePanelHeader />
    </div>
  </WorkspaceProvider>
);
