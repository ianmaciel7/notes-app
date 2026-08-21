import {
  AppHeaderDemoMain,
  AppHeaderDemoProvider,
  AppHeaderDemoSidePanel,
} from "@/components/app-header-demo"
import { AppSidebarPrimaryActionsDemo } from "@/components/app-sidebar-primary-actions"
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
  AppShellSidePanelTrigger,
  AppShellSurface,
  AppShellWorkspace,
} from "@/components/app-shell"

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
                <AppShellSurface />
              </AppShellMain>

              <AppShellSidePanel>
                <AppHeaderDemoSidePanel />
                <AppShellSurface side="side-panel" />
              </AppShellSidePanel>
            </AppShellWorkspace>
          </AppShellPanelGroup>

          <AppShellSidebarTrigger />
          <AppShellSidePanelTrigger />
        </AppShell>

        <AppShellMobile>
          <AppShellHeader className="relative">
            <AppShellMobileSidebar>
              <AppSidebarPrimaryActionsDemo />
            </AppShellMobileSidebar>
            <AppShellMobileSidePanel />
          </AppShellHeader>
          <AppShellSurface />
        </AppShellMobile>
      </AppShellProvider>
    </AppHeaderDemoProvider>
  )
}
