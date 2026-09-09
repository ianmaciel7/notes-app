import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { objectTypeDefinitions } from "@/components/object-icons";

function normalizeSvgPath(path: string) {
  return path.replaceAll(/[\s,]/g, "");
}

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
      if (!definition) {
        throw new Error(`Missing object type definition for ${id}`);
      }

      expect(definition.tone).toBe(tone);
      const Icon = definition.icon;
      const markup = renderToStaticMarkup(<Icon />);
      expect(markup).toContain(`data-icon-name="${iconName}"`);
      expect(markup).toContain("<path");
      if (id === "atomic-note") {
        const expectedPath =
          "M208,88H48a16,16,0,0,0-16,16v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104A16,16,0,0,0,208,88Zm0,112H48V104H208v96ZM48,64a8,8,0,0,1,8-8H200a8,8,0,0,1,0,16H56A8,8,0,0,1,48,64ZM64,32a8,8,0,0,1,8-8H184a8,8,0,0,1,0,16H72A8,8,0,0,1,64,32Z";
        expect(normalizeSvgPath(markup)).toContain(normalizeSvgPath(expectedPath));
      }
    },
  );
});
