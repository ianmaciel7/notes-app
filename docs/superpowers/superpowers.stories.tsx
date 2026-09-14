import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "@/components/ladle/doc-viewer";
import componentsPlan from "./plans/2026-09-14-components-audit-fix.md?raw";
import componentsDesign from "./specs/2026-09-14-components-audit-design.md?raw";

export default {
  title: "Project / Component Audit",
} satisfies StoryDefault;

export const Design: Story = () => <DocViewer markdown={componentsDesign} />;
export const Plan: Story = () => <DocViewer markdown={componentsPlan} />;
