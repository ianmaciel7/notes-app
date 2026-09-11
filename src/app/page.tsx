import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellMobile,
  AppShellMobileSidebar,
  AppShellMobileSidePanel,
  AppShellPanelGroup,
  AppShellProvider,
  AppShellSidebar,
  AppShellSidebarTrigger,
  AppShellSidePanel,
  AppShellSurface,
  AppShellWorkspace,
} from "@/app/_components/workspace/app-shell";
import {
  WorkspaceNewContentDialogController,
  WorkspaceSidebar,
} from "@/app/_components/workspace/app-sidebar-primary-actions-command-dialog";
import { FocusModeProvider } from "@/app/_components/workspace/focus-mode-provider";
import {
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
} from "@/app/_components/workspace/space-controller";
import {
  WorkspaceMainContent,
  WorkspaceSidePanelContent,
} from "@/app/_components/workspace/workspace-main-content";

export default function HomePage() {
  return (
    <AppShellProvider>
      <FocusModeProvider>
        <WorkspaceProvider>
          <WorkspaceNewContentDialogController />

          <AppShell>
            <AppShellPanelGroup>
              <AppShellSidebar>
                <WorkspaceSidebar />
              </AppShellSidebar>
              <AppShellWorkspace>
                <AppShellMain>
                  <WorkspaceMainHeader />
                  <AppShellSurface className="h-full w-full">
                    <WorkspaceMainContent />
                  </AppShellSurface>
                </AppShellMain>
                <AppShellSidePanel>
                  <WorkspaceSidePanelHeader />
                  <AppShellSurface side="side-panel" className="h-full w-full">
                    <WorkspaceSidePanelContent />
                  </AppShellSurface>
                </AppShellSidePanel>
              </AppShellWorkspace>
            </AppShellPanelGroup>

            <AppShellSidebarTrigger />
          </AppShell>

          <AppShellMobile>
            <AppShellHeader className="relative">
              <AppShellMobileSidebar>
                <WorkspaceSidebar />
              </AppShellMobileSidebar>
              <AppShellMobileSidePanel className="flex flex-col p-0">
                <WorkspaceSidePanelHeader />
                <AppShellSurface side="side-panel" className="h-full w-full">
                  <WorkspaceSidePanelContent />
                </AppShellSurface>
              </AppShellMobileSidePanel>
            </AppShellHeader>
            <AppShellSurface className="h-full w-full">
              <WorkspaceMainContent />
            </AppShellSurface>
          </AppShellMobile>
        </WorkspaceProvider>
      </FocusModeProvider>
    </AppShellProvider>
  );
}
