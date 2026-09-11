import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import componentDoc from "./component-development.md?raw";
import devDoc from "./development.md?raw";

export default {
  title: "Docs / Guides",
} satisfies StoryDefault;

export const Development: Story = () => <DocViewer markdown={devDoc} />;
Development.storyName = "Development";

export const ComponentDevelopment: Story = () => <DocViewer markdown={componentDoc} />;
ComponentDevelopment.storyName = "Component Development";
