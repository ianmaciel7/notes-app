import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import overviewPtBrDoc from "../i18n/pt-BR/architecture/README.md?raw";
import overviewEnDoc from "./README.md?raw";

type ArchitectureLocale = "pt-BR" | "en";

type ArchitectureStoryProps = {
  locale: ArchitectureLocale;
};

const overviewDocs: Record<ArchitectureLocale, string> = {
  "pt-BR": overviewPtBrDoc,
  en: overviewEnDoc,
};

export default {
  title: "Docs / Architecture",
} satisfies StoryDefault;

export const Overview: Story<ArchitectureStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={overviewDocs[locale] ?? overviewDocs.en} />
);

Overview.storyName = "README";
Overview.args = { locale: "pt-BR" };
Overview.argTypes = {
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
