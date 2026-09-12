import type { Story, StoryDefault } from "@ladle/react";
import historicalEnDoc from "../../graphify-out/HISTORICAL_REFERENCE_SYNTHESIS.md?raw";
import { DocViewer } from "../../src/components/ladle/doc-viewer";
import readmePtBrDoc from "../translations/pt-BR/architecture/README.md?raw";
import routingPtBrDoc from "../translations/pt-BR/architecture/routing.md?raw";
import spacesPtBrDoc from "../translations/pt-BR/architecture/spaces.md?raw";
import entitiesEnDoc from "./entities.md?raw";
import readmeEnDoc from "./README.md?raw";
import routingEnDoc from "./routing.md?raw";
import spacesEnDoc from "./spaces.md?raw";

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

const routingDocs: Record<ArchitectureLocale, string> = {
  "pt-BR": routingPtBrDoc,
  en: routingEnDoc,
};

const entitiesDocs: Record<ArchitectureLocale, string> = {
  "pt-BR": entitiesEnDoc,
  en: entitiesEnDoc,
};

const spacesDocs: Record<ArchitectureLocale, string> = {
  "pt-BR": spacesPtBrDoc,
  en: spacesEnDoc,
};

const historicalDocs: Record<ArchitectureLocale, string> = {
  "pt-BR": historicalEnDoc,
  en: historicalEnDoc,
};

export default {
  title: "Docs / Architecture",
} satisfies StoryDefault;

export const Overview: Story<ArchitectureStoryProps> = ({ locale = "en" }) => (
  <DocViewer markdown={readmeDocs[locale] ?? readmeDocs.en} />
);
Overview.storyName = "Overview";
Overview.args = { locale: "en" };
Overview.argTypes = localeArgTypes;

export const Routing: Story<ArchitectureStoryProps> = ({ locale = "en" }) => (
  <DocViewer markdown={routingDocs[locale] ?? routingDocs.en} />
);
Routing.storyName = "Routing & URL Architecture";
Routing.args = { locale: "en" };
Routing.argTypes = localeArgTypes;

export const Spaces: Story<ArchitectureStoryProps> = ({ locale = "en" }) => (
  <DocViewer markdown={spacesDocs[locale] ?? spacesDocs.en} />
);
Spaces.storyName = "Spaces Architecture";
Spaces.args = { locale: "en" };
Spaces.argTypes = localeArgTypes;

export const Entities: Story<ArchitectureStoryProps> = ({ locale = "en" }) => (
  <DocViewer markdown={entitiesDocs[locale] ?? entitiesDocs.en} />
);
Entities.storyName = "Entities & Domain Architecture";
Entities.args = { locale: "en" };
Entities.argTypes = localeArgTypes;

export const HistoricalSynthesis: Story<ArchitectureStoryProps> = ({ locale = "en" }) => (
  <DocViewer markdown={historicalDocs[locale] ?? historicalDocs.en} />
);
HistoricalSynthesis.storyName = "Historical Reference Synthesis";
HistoricalSynthesis.args = { locale: "en" };
HistoricalSynthesis.argTypes = localeArgTypes;
