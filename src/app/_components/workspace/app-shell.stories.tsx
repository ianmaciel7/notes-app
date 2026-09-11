import type { Story, StoryDefault } from "@ladle/react";

import {
  AppShell,
  AppShellContent,
  AppShellHeader,
  AppShellMain,
  AppShellPanelGroup,
  AppShellProvider,
  AppShellSidebar,
  AppShellSidePanel,
  AppShellSurface,
  AppShellWorkspace,
} from "./app-shell";

export default {
  title: "Components / App Shell",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="h-[500px] w-full overflow-hidden rounded-lg border">
    <AppShellProvider>
      <AppShell>
        <AppShellPanelGroup>
          <AppShellSidebar>
            <div className="p-4 text-sm font-medium">Sidebar Content</div>
          </AppShellSidebar>
          <AppShellWorkspace>
            <AppShellMain>
              <AppShellHeader className="border-b px-4">
                <div className="text-sm font-semibold">Header Bar</div>
              </AppShellHeader>
              <AppShellContent>
                <AppShellSurface side="main">
                  <div className="p-6 text-foreground">Main Content Area</div>
                </AppShellSurface>
              </AppShellContent>
            </AppShellMain>
            <AppShellSidePanel>
              <AppShellSurface side="side-panel">
                <div className="p-4 text-sm">Side Inspector Panel</div>
              </AppShellSurface>
            </AppShellSidePanel>
          </AppShellWorkspace>
        </AppShellPanelGroup>
      </AppShell>
    </AppShellProvider>
  </div>
);
