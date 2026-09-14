import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import readmePtBrDoc from "../translations/pt-BR/plans/README.md?raw";
import readmeEnDoc from "./README.md?raw";

type PlansLocale = "pt-BR" | "en";

type PlansStoryProps = {
  locale: PlansLocale;
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

const readmeDocs: Record<PlansLocale, string> = {
  "pt-BR": readmePtBrDoc,
  en: readmeEnDoc,
};

export default {
  title: "Docs / Plans",
} satisfies StoryDefault;

export const Overview: Story<PlansStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={readmeDocs[locale] ?? readmeDocs.en} />
);
Overview.storyName = "Overview";
Overview.args = { locale: "pt-BR" };
Overview.argTypes = localeArgTypes;
