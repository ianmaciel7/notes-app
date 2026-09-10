import type { Story, StoryDefault } from "@ladle/react";

import { ArchitectureDocViewer } from "../../src/components/architecture/architecture-doc-viewer";
import mainContentArchitecture from "./workspace-main-content.architecture.md?raw";
import sidePanelArchitecture from "./workspace-side-panel-content.architecture.md?raw";

export default {
  title: "Docs / Workspace",
} satisfies StoryDefault;

export const WorkspaceMainContentGraph: Story = () => (
  <ArchitectureDocViewer markdown={mainContentArchitecture} />
);

export const WorkspaceSidePanelContentGraph: Story = () => (
  <ArchitectureDocViewer markdown={sidePanelArchitecture} />
);
