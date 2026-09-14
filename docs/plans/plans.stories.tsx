import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import readmeDoc from "./README.md?raw";

export default {
  title: "Docs / Plans",
} satisfies StoryDefault;

export const Overview: Story = () => <DocViewer markdown={readmeDoc} />;
Overview.storyName = "Overview";
