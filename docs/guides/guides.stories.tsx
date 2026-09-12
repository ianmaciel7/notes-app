import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import componentEnDoc from "./component-development.en.md?raw";
import componentPtBrDoc from "./component-development.pt-BR.md?raw";
import devEnDoc from "./development.en.md?raw";
import devPtBrDoc from "./development.pt-BR.md?raw";

type GuidesLocale = "pt-BR" | "en";

type GuidesStoryProps = {
  locale: GuidesLocale;
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

const devDocs: Record<GuidesLocale, string> = {
  "pt-BR": devPtBrDoc,
  en: devEnDoc,
};

const componentDocs: Record<GuidesLocale, string> = {
  "pt-BR": componentPtBrDoc,
  en: componentEnDoc,
};

export default {
  title: "Docs / Guides",
} satisfies StoryDefault;

export const Development: Story<GuidesStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={devDocs[locale] ?? devDocs.en} />
);
Development.storyName = "Development";
Development.args = { locale: "pt-BR" };
Development.argTypes = localeArgTypes;

export const ComponentDevelopment: Story<GuidesStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={componentDocs[locale] ?? componentDocs.en} />
);
ComponentDevelopment.storyName = "Component Development";
ComponentDevelopment.args = { locale: "pt-BR" };
ComponentDevelopment.argTypes = localeArgTypes;
