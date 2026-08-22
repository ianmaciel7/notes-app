import {
  AppHeaderDemoMain,
  AppHeaderDemoProvider,
  AppHeaderDemoSidePanel,
} from "@/components/app-header-demo";
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
import { AppSidebarPrimaryActionsDemo } from "@/components/app-sidebar-primary-actions";
import {
  AtomicNotesWorkspace,
  ExploreWorkspace,
} from "@/components/capacities-en-workspace";

export default function HomePage() {
  return (
    <AppHeaderDemoProvider>
      <AppShellProvider>
        <AppShell>
          <AppShellPanelGroup>
            <AppShellSidebar>
              <AppSidebarPrimaryActionsDemo />
            </AppShellSidebar>

            <AppShellWorkspace>
              <AppShellMain>
                <AppHeaderDemoMain />
                <AppShellSurface>
                  <AtomicNotesWorkspace />
                </AppShellSurface>
              </AppShellMain>

              <AppShellSidePanel>
                <AppHeaderDemoSidePanel />
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
              <AppSidebarPrimaryActionsDemo />
            </AppShellMobileSidebar>
            <AppShellMobileSidePanel />
          </AppShellHeader>
          <AppShellSurface>
            <AtomicNotesWorkspace />
          </AppShellSurface>
        </AppShellMobile>
      </AppShellProvider>
    </AppHeaderDemoProvider>
  );
}
