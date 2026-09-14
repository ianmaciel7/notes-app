import type { Story, StoryDefault } from "@ladle/react";

import {
  SpaceShell,
  SpaceShellContent,
  SpaceShellHeader,
  SpaceShellMain,
  SpaceShellPanelGroup,
  SpaceShellProvider,
  SpaceShellSidebar,
  SpaceShellSidePanel,
  SpaceShellSurface,
  SpaceShellWorkspace,
} from "./space-shell";

export default { title: "Components / Space / Space Shell" } satisfies StoryDefault;

export const Default: Story = () => (
  <div className="h-[500px] w-full overflow-hidden rounded-lg border">
    <SpaceShellProvider>
      <SpaceShell>
        <SpaceShellPanelGroup>
          <SpaceShellSidebar>
            <div className="p-4 text-sm font-medium">Navigation</div>
          </SpaceShellSidebar>
          <SpaceShellWorkspace>
            <SpaceShellMain>
              <SpaceShellHeader className="border-b px-4">
                <div className="text-sm font-semibold">Space header</div>
              </SpaceShellHeader>
              <SpaceShellContent>
                <SpaceShellSurface>
                  <div className="p-6">Main content</div>
                </SpaceShellSurface>
              </SpaceShellContent>
            </SpaceShellMain>
            <SpaceShellSidePanel>
              <SpaceShellSurface side="side-panel">
                <div className="p-4 text-sm">Context panel</div>
              </SpaceShellSurface>
            </SpaceShellSidePanel>
          </SpaceShellWorkspace>
        </SpaceShellPanelGroup>
      </SpaceShell>
    </SpaceShellProvider>
  </div>
);
