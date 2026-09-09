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
      expect(definition?.tone).toBe(tone);
      const markup = renderToStaticMarkup(<definition.icon />);
      expect(markup).toContain(`data-icon-name="${iconName}"`);
      expect(markup).toContain("<path");
      if (id === "atomic-note") {
        expect(markup).toContain(
          "M208 88H48a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-96a16 16 0 0 0-16-16m0 112H48v-96h160zM48 64a8 8 0 0 1 8-8h144a8 8 0 0 1 0 16H56a8 8 0 0 1-8-8m16-32a8 8 0 0 1 8-8h112a8 8 0 0 1 0 16H72a8 8 0 0 1-8-8",
        );
      }
    },
  );
});
