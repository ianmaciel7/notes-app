import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import conventionsPtBrDoc from "../i18n/pt-BR/reference/conventions.md?raw";
import designSystemPtBrDoc from "../i18n/pt-BR/reference/design-system.md?raw";
import conventionsEnDoc from "./conventions.md?raw";
import designSystemEnDoc from "./design-system.md?raw";

type ReferenceLocale = "pt-BR" | "en";

type ReferenceStoryProps = {
  locale: ReferenceLocale;
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

const conventionsDocs: Record<ReferenceLocale, string> = {
  "pt-BR": conventionsPtBrDoc,
  en: conventionsEnDoc,
};

const designSystemDocs: Record<ReferenceLocale, string> = {
  "pt-BR": designSystemPtBrDoc,
  en: designSystemEnDoc,
};

export default {
  title: "Docs / Reference",
} satisfies StoryDefault;

export const Conventions: Story<ReferenceStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={conventionsDocs[locale] ?? conventionsDocs.en} />
);
Conventions.storyName = "Conventions";
Conventions.args = { locale: "pt-BR" };
Conventions.argTypes = localeArgTypes;

export const DesignSystem: Story<ReferenceStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={designSystemDocs[locale] ?? designSystemDocs.en} />
);
DesignSystem.storyName = "Design System";
DesignSystem.args = { locale: "pt-BR" };
DesignSystem.argTypes = localeArgTypes;
