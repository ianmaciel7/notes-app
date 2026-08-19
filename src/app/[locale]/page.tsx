import { AppSidebarDemo } from "@/components/app-sidebar"
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
    <AppShellProvider>
      <AppShell>
        <AppShellPanelGroup>
          <AppShellSidebar>
            <AppSidebarDemo />
          </AppShellSidebar>

          <AppShellWorkspace>
            <AppShellMain>
              <AppShellHeader />
              <AppShellSurface />
            </AppShellMain>

            <AppShellSidePanel>
              <AppShellHeader />
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
            <AppSidebarDemo />
          </AppShellMobileSidebar>
          <AppShellMobileSidePanel />
        </AppShellHeader>
        <AppShellSurface />
      </AppShellMobile>
    </AppShellProvider>
  )
}
