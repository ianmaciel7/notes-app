import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import readmePtBrDoc from "../translations/pt-BR/architecture/README.md?raw";
import readmeEnDoc from "./README.md?raw";

type ArchitectureLocale = "pt-BR" | "en";

type ArchitectureStoryProps = {
  locale: ArchitectureLocale;
};

const localeArgTypes = {
  locale: {
    control: {
      labels: {
        en: "English",
        "pt-BR": "Português do Brasil",
      },
      type: "inline-radio" as const,
    },
    options: ["pt-BR", "en"],
  },
};

const readmeDocs: Record<ArchitectureLocale, string> = {
  "pt-BR": readmePtBrDoc,
  en: readmeEnDoc,
};

export default {
  title: "Docs / Architecture",
} satisfies StoryDefault;

export const Overview: Story<ArchitectureStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={readmeDocs[locale] ?? readmeDocs.en} />
);
Overview.storyName = "Overview";
Overview.args = { locale: "pt-BR" };
Overview.argTypes = localeArgTypes;
