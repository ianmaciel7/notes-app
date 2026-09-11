import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import overviewDoc from "./overview.md?raw";

export default {
  title: "Docs / Architecture",
} satisfies StoryDefault;

export const Overview: Story = () => <DocViewer markdown={overviewDoc} />;
Overview.storyName = "Overview";
