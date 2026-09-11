import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import conventionsDoc from "./conventions.md?raw";
import designSystemDoc from "./design-system.md?raw";

export default {
  title: "Docs / Reference",
} satisfies StoryDefault;

export const Conventions: Story = () => <DocViewer markdown={conventionsDoc} />;
Conventions.storyName = "Conventions";

export const DesignSystem: Story = () => <DocViewer markdown={designSystemDoc} />;
DesignSystem.storyName = "Design System";
