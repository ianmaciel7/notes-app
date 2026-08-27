import {
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
} from "@/components/workspace-controller";
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
import { WorkspaceSidebar } from "@/components/app-sidebar-primary-actions";
import { ExploreWorkspace } from "@/components/workspace-content-surface";
import { WorkspaceViewsProvider } from "@/components/workspace-views-controller";
import { WorkspaceViewsSurface } from "@/components/workspace-views-surface";

export default function HomePage() {
  return (
    <WorkspaceViewsProvider>
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
                  <AppShellSurface>
                    <WorkspaceViewsSurface />
                  </AppShellSurface>
                </AppShellMain>

                <AppShellSidePanel>
                  <WorkspaceSidePanelHeader />
                  <AppShellSurface side="side-panel">
                    <ExploreWorkspace />
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
                <AppShellSurface side="side-panel">
                  <ExploreWorkspace />
                </AppShellSurface>
              </AppShellMobileSidePanel>
            </AppShellHeader>
            <AppShellSurface>
              <WorkspaceViewsSurface />
            </AppShellSurface>
          </AppShellMobile>
        </WorkspaceProvider>
      </AppShellProvider>
    </WorkspaceViewsProvider>
  );
}
