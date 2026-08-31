import type { Editor, Range } from "@tiptap/core";
import type { WorkspaceStructure } from "../lib/workspace-object-types.ts";
import {
  type WorkspaceEntity,
  getCreationFlow,
} from "../lib/workspace-objects.ts";

type QuickActionBlockCommandItem = {
  readonly badge?: string;
  readonly execute: (editor: Editor, range: Range) => void;
  readonly id: string;
  readonly searchTerms: readonly string[];
  readonly title: string;
};

type QuickActionSuggestionItem =
  | {
      readonly badge?: string;
      readonly execute: QuickActionBlockCommandItem["execute"];
      readonly id: string;
      readonly kind: "block";
      readonly label: string;
      readonly searchTerms: readonly string[];
    }
  | {
      readonly badge: string;
      readonly id: string;
      readonly kind: "object-create";
      readonly label: string;
      readonly objectTypeId: string;
      readonly searchTerms: readonly string[];
    };

type TagSuggestionItem = {
  readonly badge: string;
  readonly id: string;
  readonly kind: "tag";
  readonly label: string;
  readonly searchTerms: readonly string[];
  readonly tagId?: string;
};

function normalizeSuggestionQuery(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function suggestionTermMatches(term: string, query: string) {
  const normalizedTerm = normalizeSuggestionQuery(term);
  if (normalizedTerm.startsWith(query)) return true;
  return normalizedTerm
    .split(/[\s-]+/)
    .some((token) => token.startsWith(query));
}

function validTagLabel(value: string) {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 &&
    trimmed.length <= 64 &&
    /^[\p{L}\p{N}][\p{L}\p{N}_ -]*$/u.test(trimmed)
  );
}

function isInstantEditorCreatableStructure(
  structure: WorkspaceStructure,
  structures: readonly WorkspaceStructure[],
) {
  const flow = getCreationFlow(structure.id, structures);
  return (
    structure.ownership !== "reserved" &&
    flow !== null &&
    flow !== "file" &&
    flow !== "url"
  );
}

function createPlusSuggestionItems({
  blockItems,
  query,
  structures,
}: {
  readonly blockItems: readonly QuickActionBlockCommandItem[];
  readonly query: string;
  readonly structures: readonly WorkspaceStructure[];
}): QuickActionSuggestionItem[] {
  const normalizedQuery = normalizeSuggestionQuery(query);
  const mappedBlockItems: QuickActionSuggestionItem[] = blockItems.map((item) => ({
    badge: item.badge,
    execute: item.execute,
    id: `block:${item.id}`,
    kind: "block",
    label: item.title,
    searchTerms: item.searchTerms,
  }));
  const objectItems: QuickActionSuggestionItem[] = structures
    .filter((structure) =>
      isInstantEditorCreatableStructure(structure, structures),
    )
    .map((structure) => ({
      badge: structure.singularName,
      id: `object-create:${structure.id}`,
      kind: "object-create",
      label: structure.singularName,
      objectTypeId: structure.id,
      searchTerms: [
        structure.singularName,
        structure.pluralName,
        structure.id,
      ],
    }));
  const items = [...mappedBlockItems, ...objectItems];
  if (!normalizedQuery) return items;
  return items.filter((item) =>
    [item.label, ...item.searchTerms].some((term) =>
      suggestionTermMatches(term, normalizedQuery),
    ),
  );
}

function createTagSuggestionItems({
  createTagLabel = "Create tag",
  entities,
  query,
  tagTitle = "Tag",
}: {
  readonly createTagLabel?: string;
  readonly entities: readonly WorkspaceEntity[];
  readonly query: string;
  readonly tagTitle?: string;
}): TagSuggestionItem[] {
  const normalizedQuery = normalizeSuggestionQuery(query);
  const tags = entities
    .filter((entity) => entity.kind === "tag")
    .map((tag) => ({
      badge: tagTitle,
      id: `tag:${tag.id}`,
      kind: "tag" as const,
      label: tag.title.trim() || tag.id,
      searchTerms: [tag.title, tag.id],
      tagId: tag.id,
    }));
  const seen = new Set<string>();
  const filtered = tags.filter((tag) => {
    const normalizedLabel = normalizeSuggestionQuery(tag.label);
    if (seen.has(normalizedLabel)) return false;
    seen.add(normalizedLabel);
    if (!normalizedQuery) return true;
    return [tag.label, ...tag.searchTerms].some((term) =>
      suggestionTermMatches(term, normalizedQuery),
    );
  });
  const exactMatch = tags.some(
    (tag) => normalizeSuggestionQuery(tag.label) === normalizedQuery,
  );
  if (validTagLabel(query) && !exactMatch) {
    return [
      ...filtered,
      {
        badge: tagTitle,
        id: `tag-create:${normalizedQuery}`,
        kind: "tag",
        label: `${createTagLabel}: ${query.trim()}`,
        searchTerms: [query],
      },
    ];
  }
  return filtered;
}

export type {
  QuickActionBlockCommandItem,
  QuickActionSuggestionItem,
  TagSuggestionItem,
};
export {
  createPlusSuggestionItems,
  createTagSuggestionItems,
  normalizeSuggestionQuery,
  validTagLabel,
};
