import type { Story } from "@ladle/react";

import { ArchitectureDocViewer } from "./architecture-doc-viewer";
import mainContentArchitecture from "./workspace-main-content.architecture.md?raw";
import sidePanelArchitecture from "./workspace-side-panel-content.architecture.md?raw";

export const WorkspaceMainContentGraph: Story = () => (
  <ArchitectureDocViewer markdown={mainContentArchitecture} />
);

export const WorkspaceSidePanelContentGraph: Story = () => (
  <ArchitectureDocViewer markdown={sidePanelArchitecture} />
);
