import type { Story, StoryDefault } from "@ladle/react";

import { DocViewer } from "../../../src/components/ladle/doc-viewer";
import workspaceUiEn from "./ui.md?raw";
import workspaceUiPtBr from "./ui.pt-BR.md?raw";

type WorkspaceArchitectureLocale = "pt-BR" | "en";

type WorkspaceArchitectureStoryProps = {
  locale: WorkspaceArchitectureLocale;
};

const workspaceMainContentDocs: Record<WorkspaceArchitectureLocale, string> = {
  "pt-BR": workspaceUiPtBr,
  en: workspaceUiEn,
};

export default {
  title: "Docs / Architecture / Workspace",
} satisfies StoryDefault;

export const WorkspaceMainContentGraph: Story<WorkspaceArchitectureStoryProps> = ({
  locale = "pt-BR",
}) => <DocViewer markdown={workspaceMainContentDocs[locale] ?? workspaceMainContentDocs.en} />;

WorkspaceMainContentGraph.storyName = "UI";
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
