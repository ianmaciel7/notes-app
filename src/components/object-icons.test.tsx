import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ObjectTypeLabelChip, objectTypeDefinitions } from "@/components/object-icons";

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
  "study-goal": ["study-goal", "lime"],
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

  it("renders flashcards as a clean two-card icon", () => {
    const definition = objectTypeDefinitions.find((item) => item.id === "flashcard");

    expect(definition).toBeDefined();
    if (!definition) {
      throw new Error("Missing object type definition for flashcard");
    }

    const Icon = definition.icon;
    const markup = renderToStaticMarkup(<Icon />);
    const pathCount = markup.match(/<path/g)?.length ?? 0;

    expect(pathCount).toBeGreaterThanOrEqual(2);
    expect(pathCount).toBeLessThanOrEqual(3);
  });

  it("renders media with the Capacities split-panel glyph", () => {
    const definition = objectTypeDefinitions.find((item) => item.id === "media");

    expect(definition).toBeDefined();
    if (!definition) {
      throw new Error("Missing object type definition for media");
    }

    const Icon = definition.icon;
    const markup = renderToStaticMarkup(<Icon />);

    expect(markup).toContain("M40,80H144V200H40");
    expect(markup).toContain("H160V80h56");
    expect(markup).toContain("a12,12,0,1,1-12-12");
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

describe("object type label chip visual contract", () => {
  it("renders the Capacities-style object type label chip in default and compact scales", () => {
    const defaultMarkup = renderToStaticMarkup(
      <ObjectTypeLabelChip
        id="page"
        iconName="page"
        label="Página"
        tone="blue"
        variant="default"
      />,
    );
    const compactMarkup = renderToStaticMarkup(
      <ObjectTypeLabelChip
        id="atomic-note"
        iconName="atomic-note"
        label="Nota atômica"
        tone="amber"
        variant="compact"
      />,
    );

    expect(defaultMarkup).toContain('data-slot="object-type-label-chip"');
    expect(defaultMarkup).toContain("text-[14px]");
    expect(defaultMarkup).toContain("leading-[1.3]");
    expect(defaultMarkup).toContain("px-[0.49em]");
    expect(defaultMarkup).toContain("py-[0.2em]");
    expect(defaultMarkup).toContain("rounded-[0.475em]");
    expect(defaultMarkup).toContain("border-[0.0625em]");
    expect(defaultMarkup).toContain("var(--type-label-bg-blue)");
    expect(defaultMarkup).toContain("var(--type-label-border-blue)");
    expect(defaultMarkup).toContain("var(--type-label-text-blue)");
    expect(defaultMarkup).toContain("Página");
    expect(defaultMarkup).toContain('data-slot="object-type-label-chip-icon"');
    expect(defaultMarkup).toContain('data-slot="object-type-label-chip-text"');

    expect(compactMarkup).toContain("text-[11px]");
    expect(compactMarkup).toContain("Nota atômica");
    expect(compactMarkup).toContain("var(--type-label-bg-amber)");
  });

  it("resolves the correct icon for every label chip from the object type id", () => {
    for (const definition of objectTypeDefinitions) {
      const markup = renderToStaticMarkup(
        <ObjectTypeLabelChip
          id={definition.id}
          label={definition.label}
          tone={definition.tone}
          variant="default"
        />,
      );

      expect(markup).toContain(`data-local-object-icon="${definition.id}"`);
      if (definition.id !== "area") {
        expect(markup).not.toContain('data-local-object-icon="area"');
      }
    }
  });

  it("renders interactive chips as keyboard-reachable controls with a menu affordance", () => {
    const markup = renderToStaticMarkup(
      <ObjectTypeLabelChip
        id="page"
        label="Página"
        onClick={() => undefined}
        showMenuIndicator
        tone="blue"
      />,
    );

    expect(markup).toContain('data-interactive="true"');
    expect(markup).toContain("<button");
    expect(markup).toContain('type="button"');
    expect(markup).toContain("hover:brightness-[0.98]");
    expect(markup).toContain('data-slot="object-type-label-chip-menu-indicator"');
  });
});
