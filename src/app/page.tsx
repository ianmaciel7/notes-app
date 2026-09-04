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
} from "@/components/app-shell";
import { WorkspaceSidebar } from "@/components/app-sidebar-primary-actions-command-dialog";
import {
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
} from "@/components/workspace-controller";

export default function HomePage() {
  return (
    <AppShellProvider>
      <WorkspaceProvider>
        <AppShell>
          <AppShellPanelGroup>
            <AppShellSidebar>
              <WorkspaceSidebar />
            </AppShellSidebar>

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

          <AppShellSidebarTrigger />
        </AppShell>

        <AppShellMobile>
          <AppShellHeader className="relative">
            <AppShellMobileSidebar>
              <WorkspaceSidebar />
            </AppShellMobileSidebar>
            <AppShellMobileSidePanel className="flex flex-col p-0">
              <WorkspaceSidePanelHeader />
              <AppShellSurface side="side-panel" className="h-full w-full" />
            </AppShellMobileSidePanel>
          </AppShellHeader>
          <AppShellSurface className="h-full w-full" />
        </AppShellMobile>
      </WorkspaceProvider>
    </AppShellProvider>
  );
}
