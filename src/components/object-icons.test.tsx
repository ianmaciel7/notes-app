import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { objectTypeDefinitions } from "@/components/object-icons";

const expectedObjectTypes = {
  book: ["book", "purple"],
  person: ["person", "orange"],
  area: ["area", "indigo"],
  meeting: ["meeting", "red"],
  quote: ["quote", "rose"],
  definition: ["definition", "violet"],
  flashcard: ["flashcard", "fuchsia"],
  idea: ["idea", "yellow"],
  place: ["place", "emerald"],
  project: ["project", "green"],
  organization: ["organization", "red"],
  "atomic-note": ["atomic-note", "amber"],
  media: ["media", "teal"],
  travel: ["travel", "violet"],
  page: ["page", "blue"],
  tag: ["tag", "orange"],
  image: ["image", "red"],
  weblink: ["weblink", "blue"],
  pdf: ["pdf", "red"],
  audio: ["audio", "red"],
  file: ["file", "red"],
  tweet: ["tweet", "blue"],
  "ai-chat": ["ai-chat", "purple"],
  study_goal: ["study-goal", "lime"],
  table: ["table", "blue"],
  task: ["task", "orange"],
  query: ["query", "green"],
} as const;

describe("object type visual contract", () => {
  it.each(Object.entries(expectedObjectTypes))(
    "%s uses the Capacities icon and color",
    (id, [iconName, tone]) => {
      const definition = objectTypeDefinitions.find((item) => item.id === id);

      expect(definition).toBeDefined();
      if (!definition) {
        throw new Error(`Missing object type definition for ${id}`);
      }

      expect(definition.tone).toBe(tone);
      const Icon = definition.icon;
      const markup = renderToStaticMarkup(<Icon />);
      expect(markup).toContain(`data-icon-name="${iconName}"`);
      expect(markup).toContain(`data-local-object-icon="${iconName}"`);
      expect(markup).toContain('viewBox="0 0 256 256"');
      expect(markup).toContain('fill="currentColor"');
      expect(markup).toContain("<path");
    },
  );

  it("uses distinct study icons and colors for flashcards and study goals", () => {
    const source = readFileSync(new URL("object-icons.tsx", import.meta.url), "utf8");

    expect(source).toContain("flashcard: [");
    expect(source).toContain('"study-goal": [');
    expect(source).toContain('flashcard: "fuchsia"');
    expect(source).toContain('study_goal: "lime"');
  });

  it("renders every object type from local React SVG components", () => {
    const source = readFileSync(new URL("object-icons.tsx", import.meta.url), "utf8");

    expect(source).not.toContain("@phosphor-icons/react/dist/csr");

    for (const definition of objectTypeDefinitions) {
      const Icon = definition.icon;
      const markup = renderToStaticMarkup(<Icon />);

      expect(markup).toContain("data-local-object-icon=");
      expect(markup).toContain("<svg");
      expect(markup).toContain("<path");
    }
  });
});
