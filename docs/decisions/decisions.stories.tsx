import type { Story, StoryDefault } from "@ladle/react";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import adr1EnDoc from "./0001-nextjs-16-react-19-baseline.en.md?raw";
import adr1PtBrDoc from "./0001-nextjs-16-react-19-baseline.pt-BR.md?raw";
import adr2EnDoc from "./0002-biome-linter-formatter.en.md?raw";
import adr2PtBrDoc from "./0002-biome-linter-formatter.pt-BR.md?raw";
import adr3EnDoc from "./0003-automated-knowledge-graph-husky.en.md?raw";
import adr3PtBrDoc from "./0003-automated-knowledge-graph-husky.pt-BR.md?raw";
import adr4EnDoc from "./0004-strict-path-portability.en.md?raw";
import adr4PtBrDoc from "./0004-strict-path-portability.pt-BR.md?raw";
import readmeEnDoc from "./README.en.md?raw";
import readmePtBrDoc from "./README.pt-BR.md?raw";

type DecisionsLocale = "pt-BR" | "en";

type DecisionsStoryProps = {
  locale: DecisionsLocale;
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

const readmeDocs: Record<DecisionsLocale, string> = {
  "pt-BR": readmePtBrDoc,
  en: readmeEnDoc,
};

const adr1Docs: Record<DecisionsLocale, string> = {
  "pt-BR": adr1PtBrDoc,
  en: adr1EnDoc,
};

const adr2Docs: Record<DecisionsLocale, string> = {
  "pt-BR": adr2PtBrDoc,
  en: adr2EnDoc,
};

const adr3Docs: Record<DecisionsLocale, string> = {
  "pt-BR": adr3PtBrDoc,
  en: adr3EnDoc,
};

const adr4Docs: Record<DecisionsLocale, string> = {
  "pt-BR": adr4PtBrDoc,
  en: adr4EnDoc,
};

export default {
  title: "Docs / Decisions",
} satisfies StoryDefault;

export const Overview: Story<DecisionsStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={readmeDocs[locale] ?? readmeDocs.en} />
);
Overview.storyName = "README";
Overview.args = { locale: "pt-BR" };
Overview.argTypes = localeArgTypes;

export const ADR0001: Story<DecisionsStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={adr1Docs[locale] ?? adr1Docs.en} />
);
ADR0001.storyName = "0001 - Next.js 16 & React 19";
ADR0001.args = { locale: "pt-BR" };
ADR0001.argTypes = localeArgTypes;

export const ADR0002: Story<DecisionsStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={adr2Docs[locale] ?? adr2Docs.en} />
);
ADR0002.storyName = "0002 - Biome Linter";
ADR0002.args = { locale: "pt-BR" };
ADR0002.argTypes = localeArgTypes;

export const ADR0003: Story<DecisionsStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={adr3Docs[locale] ?? adr3Docs.en} />
);
ADR0003.storyName = "0003 - Knowledge Graph";
ADR0003.args = { locale: "pt-BR" };
ADR0003.argTypes = localeArgTypes;

export const ADR0004: Story<DecisionsStoryProps> = ({ locale = "pt-BR" }) => (
  <DocViewer markdown={adr4Docs[locale] ?? adr4Docs.en} />
);
ADR0004.storyName = "0004 - Path Portability";
ADR0004.args = { locale: "pt-BR" };
ADR0004.argTypes = localeArgTypes;
