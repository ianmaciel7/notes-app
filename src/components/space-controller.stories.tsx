import type { Story, StoryDefault } from "@ladle/react";

import {
  AppShell,
  AppShellMain,
  AppShellPanelGroup,
  AppShellProvider,
  AppShellSidebar,
  AppShellSidePanel,
  AppShellSurface,
  AppShellWorkspace,
} from "./app-shell";
import { WorkspaceNewContentDialogController } from "./app-sidebar-primary-actions-command-dialog";
import { FocusModeProvider } from "./focus-mode-provider";
import {
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
} from "./space-controller";

export default {
  title: "Components / Space controller",
} satisfies StoryDefault;

function WorkspaceStoryFrame({ children }: { children: React.ReactNode }) {
  return (
    <AppShellProvider>
      <FocusModeProvider>
        <WorkspaceProvider>
          <WorkspaceNewContentDialogController />
          <div className="h-screen w-full overflow-hidden bg-sidebar">{children}</div>
        </WorkspaceProvider>
      </FocusModeProvider>
    </AppShellProvider>
  );
}

export const MainHeaderInWorkspace: Story = () => (
  <WorkspaceStoryFrame>
    <AppShell>
      <AppShellPanelGroup>
        <AppShellSidebar />
        <AppShellWorkspace>
          <AppShellMain>
            <WorkspaceMainHeader />
            <AppShellSurface className="h-full w-full" />
          </AppShellMain>
          <AppShellSidePanel>
            <WorkspaceSidePanelHeader />
            <AppShellSurface side="side-panel" className="h-full w-full" />
          </AppShellSidePanel>
        </AppShellWorkspace>
      </AppShellPanelGroup>
    </AppShell>
  </WorkspaceStoryFrame>
);

export const SidePanelHeaderInWorkspace: Story = () => (
  <WorkspaceStoryFrame>
    <AppShell>
      <AppShellPanelGroup>
        <AppShellSidebar />
        <AppShellWorkspace>
          <AppShellMain>
            <WorkspaceMainHeader />
            <AppShellSurface className="h-full w-full" />
          </AppShellMain>
          <AppShellSidePanel>
            <WorkspaceSidePanelHeader />
            <AppShellSurface side="side-panel" className="h-full w-full" />
          </AppShellSidePanel>
        </AppShellWorkspace>
      </AppShellPanelGroup>
    </AppShell>
  </WorkspaceStoryFrame>
);
