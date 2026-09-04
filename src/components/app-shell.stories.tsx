import type { Story } from "@ladle/react";
import { NextIntlClientProvider } from "next-intl";

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

const messages = {
  workspace: {
    shell: {
      expandNavigation: "Expand Navigation",
      collapseNavigation: "Collapse Navigation",
      expandContext: "Expand Context",
      collapseContext: "Collapse Context",
      openNavigation: "Open Navigation",
      navigationTitle: "Navigation",
      navigationDescription: "Main navigation panel",
      openContext: "Open Context",
      contextTitle: "Context",
      contextDescription: "Side panel context",
    },
  },
};

export const FullAppShell: Story = () => (
  <NextIntlClientProvider locale="en" messages={messages}>
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
  </NextIntlClientProvider>
);
