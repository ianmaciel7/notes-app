import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

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

describe("SpaceShell", () => {
  it("exposes the composable three-pane shell structure", () => {
    const html = renderToStaticMarkup(
      <SpaceShellProvider>
        <SpaceShell>
          <SpaceShellPanelGroup>
            <SpaceShellSidebar>Navigation</SpaceShellSidebar>
            <SpaceShellWorkspace>
              <SpaceShellMain>
                <SpaceShellHeader>Header</SpaceShellHeader>
                <SpaceShellContent>
                  <SpaceShellSurface>Main</SpaceShellSurface>
                </SpaceShellContent>
              </SpaceShellMain>
              <SpaceShellSidePanel>
                <SpaceShellSurface side="side-panel">Context</SpaceShellSurface>
              </SpaceShellSidePanel>
            </SpaceShellWorkspace>
          </SpaceShellPanelGroup>
        </SpaceShell>
      </SpaceShellProvider>,
    );

    expect(html).toContain('data-slot="space-shell-provider"');
    expect(html).toContain('data-slot="space-shell-sidebar"');
    expect(html).toContain('data-slot="space-shell-main"');
    expect(html).toContain('data-slot="space-shell-side-panel"');
    expect(html).toContain('data-side="side-panel"');
  });
});
