import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import adr1Doc from "./0001-nextjs-16-react-19-baseline.md?raw";
import adr2Doc from "./0002-biome-linter-formatter.md?raw";
import adr3Doc from "./0003-automated-knowledge-graph-husky.md?raw";
import adr4Doc from "./0004-strict-path-portability.md?raw";
import readmeDoc from "./README.md?raw";

export default {
  title: "Docs / Architecture Decisions",
} satisfies StoryDefault;

export const Overview: Story = () => <DocViewer markdown={readmeDoc} />;
Overview.storyName = "ADR Index";

export const ADR0001: Story = () => <DocViewer markdown={adr1Doc} />;
ADR0001.storyName = "0001: Next.js 16 + React 19";

export const ADR0002: Story = () => <DocViewer markdown={adr2Doc} />;
ADR0002.storyName = "0002: Biome Linter";

export const ADR0003: Story = () => <DocViewer markdown={adr3Doc} />;
ADR0003.storyName = "0003: Knowledge Graph";

export const ADR0004: Story = () => <DocViewer markdown={adr4Doc} />;
ADR0004.storyName = "0004: Path Portability";
