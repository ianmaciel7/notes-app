import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import readmePtBrDoc from "../translations/pt-BR/design/README.md?raw";
import readmeEnDoc from "./README.md?raw";

type DesignLocale = "pt-BR" | "en";

type DesignStoryProps = {
  locale: DesignLocale;
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

const designSystemDocs: Record<DesignLocale, string> = {
  "pt-BR": readmePtBrDoc,
  en: readmeEnDoc,
};

export default {
  title: "Docs / Design",
} satisfies StoryDefault;

export const DesignSystem: Story<DesignStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={designSystemDocs[locale] ?? designSystemDocs.en} />
);
DesignSystem.storyName = "Design System";
DesignSystem.args = { locale: "pt-BR" };
DesignSystem.argTypes = localeArgTypes;
