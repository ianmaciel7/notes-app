import type { Story, StoryDefault } from "@ladle/react";

import { DocViewer } from "../../../src/components/ladle/doc-viewer";
import mainContentArchitectureEn from "./workspace-main-content.architecture.en.md?raw";
import mainContentArchitecturePtBr from "./workspace-main-content.architecture.pt-BR.md?raw";

type WorkspaceArchitectureLocale = "pt-BR" | "en";

type WorkspaceArchitectureStoryProps = {
  locale: WorkspaceArchitectureLocale;
};

const workspaceMainContentDocs: Record<WorkspaceArchitectureLocale, string> = {
  "pt-BR": mainContentArchitecturePtBr,
  en: mainContentArchitectureEn,
};

export default {
  title: "Docs / Workspace",
} satisfies StoryDefault;

export const WorkspaceMainContentGraph: Story<WorkspaceArchitectureStoryProps> = ({
  locale = "pt-BR",
}) => <DocViewer markdown={workspaceMainContentDocs[locale] ?? workspaceMainContentDocs.en} />;

WorkspaceMainContentGraph.storyName = "Main Content";
WorkspaceMainContentGraph.args = { locale: "pt-BR" };
WorkspaceMainContentGraph.argTypes = {
  locale: {
    control: {
      labels: {
        en: "English",
        "pt-BR": "Português do Brasil",
      },
      type: "inline-radio",
    },
    options: ["pt-BR", "en"],
  },
};
