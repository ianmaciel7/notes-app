import { blockEditorDocumentToPlainText } from "../editor/document.ts";
import {
  createWorkspaceObjectLinkIndex,
  selectBacklinksForObject,
  selectObjectsInside,
  selectPropertyRelationGraphEdges,
} from "./workspace-object-links.ts";
import type { WorkspaceEntity } from "./workspace-objects.ts";
import { exportFormulaCell } from "./workspace-table-formulas.ts";

const NOTES_APP_RELATED_CONTENT_PROVIDER_ID =
  "notes-app-local-related-content";
const NOTES_APP_RELATED_CONTENT_PROVIDER_VERSION = "1";
const DEFAULT_RELATED_CONTENT_LIMIT = 5;
const RELATED_CONTENT_PANEL_LIMIT = 25;

type RelatedContentReason =
  | "lexical"
  | "direct-link"
  | "backlink"
  | "property-relation"
  | "shared-tag"
  | "shared-collection"
  | "recency";

type RelatedContentProviderInput = {
  readonly candidateIds?: readonly string[];
  readonly entities: readonly WorkspaceEntity[];
  readonly generatedAt?: string;
  readonly indexRevision: string;
  readonly limit?: number;
  readonly offline?: boolean;
  readonly sourceId: string;
  readonly sourceRevision: string;
  readonly spaceId: string;
};

type RelatedContentProviderResult = {
  readonly generatedAt: string;
  readonly partial?: boolean;
  readonly providerId: string;
  readonly providerVersion: string;
  readonly results: readonly RelatedContentResult[];
  readonly revision: string;
  readonly stale?: boolean;
};

type RelatedContentResult = {
  readonly providerId: string;
  readonly providerVersion: string;
  readonly reasons: readonly RelatedContentReason[];
  readonly score: number;
  readonly stale?: boolean;
  readonly targetId: string;
};

type RelatedContentProvider = {
  readonly id: string;
  readonly version: string;
  rank(input: RelatedContentProviderInput): RelatedContentProviderResult;
};

type RelatedContentState =
  | {
      readonly kind: "ready";
      readonly generatedAt: string;
      readonly providerId: string;
      readonly providerVersion: string;
      readonly results: readonly RelatedContentResult[];
      readonly revision: string;
      readonly stale?: boolean;
      readonly partial?: boolean;
    }
  | {
      readonly kind: "empty";
      readonly generatedAt: string;
      readonly providerId: string;
      readonly providerVersion: string;
      readonly revision: string;
      readonly stale?: boolean;
      readonly partial?: boolean;
    }
  | {
      readonly kind: "unavailable";
      readonly reason:
        | "missing-source"
        | "unsupported-source"
        | "insufficient-candidates";
      readonly providerId: string;
      readonly providerVersion: string;
    }
  | {
      readonly kind: "error";
      readonly message: string;
      readonly providerId: string;
      readonly providerVersion: string;
    };

type RelatedContentCacheKeyInput = Pick<
  RelatedContentProviderInput,
  "indexRevision" | "limit" | "sourceId" | "sourceRevision" | "spaceId"
> & {
  readonly providerId?: string;
  readonly providerVersion?: string;
};

type RelatedContentMutation =
  | { readonly type: "entity"; readonly entityId: string }
  | { readonly type: "index"; readonly indexRevision: string }
  | { readonly type: "space"; readonly spaceId: string };

type RelatedContentCacheEntry = {
  readonly key: string;
  readonly state: RelatedContentState;
};

function relatedContentCacheKey(input: RelatedContentCacheKeyInput): string {
  return [
    input.spaceId,
    input.sourceId,
    input.sourceRevision,
    input.indexRevision,
    input.providerId ?? NOTES_APP_RELATED_CONTENT_PROVIDER_ID,
    input.providerVersion ?? NOTES_APP_RELATED_CONTENT_PROVIDER_VERSION,
    input.limit ?? DEFAULT_RELATED_CONTENT_LIMIT,
  ].join(":");
}

class RelatedContentCache {
  readonly #entries = new Map<string, RelatedContentCacheEntry>();

  get(key: string): RelatedContentState | undefined {
    return this.#entries.get(key)?.state;
  }

  set(key: string, state: RelatedContentState): void {
    this.#entries.set(key, { key, state });
  }

  invalidate(mutation: RelatedContentMutation): void {
    for (const key of this.#entries.keys()) {
      if (
        (mutation.type === "space" && key.startsWith(`${mutation.spaceId}:`)) ||
        (mutation.type === "entity" && key.includes(`:${mutation.entityId}:`)) ||
        (mutation.type === "index" && key.includes(`:${mutation.indexRevision}:`))
      ) {
        this.#entries.delete(key);
      }
    }
  }
}

function isDocumentLike(
  entity: WorkspaceEntity,
): entity is Extract<WorkspaceEntity, { kind: "document" | "quote" }> {
  return entity.kind === "document" || entity.kind === "quote";
}

function isRelatedContentEligible(entity: WorkspaceEntity): boolean {
  return isDocumentLike(entity) || entity.kind === "table";
}

function readEntitySpaceId(entity: WorkspaceEntity): string | undefined {
  if (entity.kind === "document") return entity.dailyNote?.spaceId;
  const record = entity as WorkspaceEntity & { readonly spaceId?: string };
  return record.spaceId;
}

function isTrashedEntity(entity: WorkspaceEntity): boolean {
  const record = entity as WorkspaceEntity & {
    readonly deletedAt?: string | null;
    readonly trashed?: boolean;
    readonly trashState?: string;
  };
  return (
    record.trashed === true ||
    Boolean(record.deletedAt) ||
    record.trashState === "trashed"
  );
}

function isSameSpace(entity: WorkspaceEntity, spaceId: string): boolean {
  const entitySpaceId = readEntitySpaceId(entity);
  return !entitySpaceId || entitySpaceId === spaceId;
}

function normalizeText(value: string): readonly string[] {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length >= 3);
}

function textForEntity(entity: WorkspaceEntity): string {
  const values = [entity.title];
  if ("aliases" in entity) values.push(...(entity.aliases ?? []));
  if ("description" in entity && entity.description) values.push(entity.description);
  if (isDocumentLike(entity)) values.push(blockEditorDocumentToPlainText(entity.body));
  if (entity.kind === "table") {
    values.push(
      entity.notes,
      ...entity.cells.map((cell) => exportFormulaCell(cell.value, "csv-result")),
    );
  }
  for (const value of Object.values(entity.propertyValues)) {
    if (value.type === "text") {
      const text = value.text.value;
      if (typeof text === "string") {
        values.push(text);
      } else {
        values.push(text.join(" "));
      }
    }
    if (value.type === "richText") {
      values.push(blockEditorDocumentToPlainText(value.richText));
    }
  }
  return values.join(" ");
}

function sharedCount(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): number {
  if (!left?.length || !right?.length) return 0;
  const rightSet = new Set(right);
  return left.filter((id) => rightSet.has(id)).length;
}

function entityCollections(entity: WorkspaceEntity): readonly string[] {
  return "collections" in entity ? entity.collections : [];
}

function entityTags(entity: WorkspaceEntity): readonly string[] {
  return "tags" in entity ? entity.tags : [];
}

function lexicalScore(source: WorkspaceEntity, candidate: WorkspaceEntity): number {
  const sourceTokens = new Set(normalizeText(textForEntity(source)));
  if (sourceTokens.size === 0) return 0;
  const candidateTokens = new Set(normalizeText(textForEntity(candidate)));
  let matches = 0;
  for (const token of candidateTokens) {
    if (sourceTokens.has(token)) matches += 1;
  }
  return Math.min(matches / Math.max(sourceTokens.size, 1), 1);
}

function readUpdatedAt(entity: WorkspaceEntity): string {
  const value = entity.propertyValues.lastUpdatedAt;
  return value?.type === "lastUpdatedAt"
    ? value.lastUpdatedAt.value
    : entity.createdAt;
}

function recencyScore(entity: WorkspaceEntity, newestTime: number): number {
  const time = Date.parse(readUpdatedAt(entity));
  if (!Number.isFinite(time) || !Number.isFinite(newestTime) || newestTime <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(time / newestTime, 1));
}

function validateRelatedContentResults(
  input: RelatedContentProviderInput,
  result: RelatedContentProviderResult,
): RelatedContentProviderResult {
  const entitiesById = new Map(input.entities.map((entity) => [entity.id, entity]));
  const seen = new Set<string>();
  const limit = Math.max(0, input.limit ?? DEFAULT_RELATED_CONTENT_LIMIT);
  const results: RelatedContentResult[] = [];
  for (const item of result.results) {
    if (seen.has(item.targetId) || item.targetId === input.sourceId) continue;
    if (!Number.isFinite(item.score)) continue;
    const entity = entitiesById.get(item.targetId);
    if (!entity || isTrashedEntity(entity) || !isSameSpace(entity, input.spaceId)) {
      continue;
    }
    seen.add(item.targetId);
    results.push({
      ...item,
      providerId: result.providerId,
      providerVersion: result.providerVersion,
      score: item.score,
    });
    if (results.length >= limit) break;
  }
  return { ...result, results };
}

type RelatedContentSignalContext = {
  readonly backlinks: ReadonlySet<string>;
  readonly directLinks: ReadonlySet<string>;
  readonly newestTime: number;
  readonly providerId: string;
  readonly providerVersion: string;
  readonly relationIds: ReadonlySet<string>;
  readonly source: WorkspaceEntity;
};

function scoreRelatedContentCandidate(
  context: RelatedContentSignalContext,
  candidate: WorkspaceEntity,
): RelatedContentResult | null {
  const reasons: RelatedContentReason[] = [];
  let score = 0;
  const lexical = lexicalScore(context.source, candidate);
  const weightedSignals: readonly [
    boolean,
    RelatedContentReason,
    number,
  ][] = [
    [lexical > 0, "lexical", lexical * 3],
    [context.directLinks.has(candidate.id), "direct-link", 5],
    [context.backlinks.has(candidate.id), "backlink", 4],
    [context.relationIds.has(candidate.id), "property-relation", 3],
    [
      sharedCount(entityTags(context.source), entityTags(candidate)) > 0,
      "shared-tag",
      sharedCount(entityTags(context.source), entityTags(candidate)) * 1.5,
    ],
    [
      sharedCount(entityCollections(context.source), entityCollections(candidate)) >
        0,
      "shared-collection",
      sharedCount(
        entityCollections(context.source),
        entityCollections(candidate),
      ),
    ],
  ];
  for (const [matched, reason, weight] of weightedSignals) {
    if (!matched) continue;
    reasons.push(reason);
    score += weight;
  }
  const recent = score > 0 ? recencyScore(candidate, context.newestTime) * 0.01 : 0;
  if (recent > 0) {
    reasons.push("recency");
    score += recent;
  }
  return score > 0
    ? {
        providerId: context.providerId,
        providerVersion: context.providerVersion,
        reasons,
        score,
        targetId: candidate.id,
      }
    : null;
}

const notesAppLocalRelatedContentProvider: RelatedContentProvider = {
  id: NOTES_APP_RELATED_CONTENT_PROVIDER_ID,
  version: NOTES_APP_RELATED_CONTENT_PROVIDER_VERSION,
  rank(input) {
    const source = input.entities.find((entity) => entity.id === input.sourceId);
    const generatedAt = input.generatedAt ?? new Date().toISOString();
    if (!source || !isRelatedContentEligible(source)) {
      return {
        generatedAt,
        providerId: this.id,
        providerVersion: this.version,
        results: [],
        revision: relatedContentCacheKey(input),
      };
    }
    const linkIndex = createWorkspaceObjectLinkIndex(input.entities);
    const backlinks = new Set(
      selectBacklinksForObject(linkIndex, input.sourceId).map(
        (item) => item.sourceId,
      ),
    );
    const directLinks = new Set(
      selectObjectsInside(linkIndex, input.sourceId).map((item) => item.targetId),
    );
    const relationIds = new Set<string>();
    for (const edge of selectPropertyRelationGraphEdges(input.entities)) {
      if (edge.from === input.sourceId) relationIds.add(edge.to);
      if (edge.to === input.sourceId) relationIds.add(edge.from);
    }
    const candidateIdSet = input.candidateIds
      ? new Set(input.candidateIds)
      : undefined;
    const newestTime = Math.max(
      ...input.entities.map((entity) => Date.parse(readUpdatedAt(entity)) || 0),
      0,
    );
    const context = {
      backlinks,
      directLinks,
      newestTime,
      providerId: this.id,
      providerVersion: this.version,
      relationIds,
      source,
    };
    const scored = input.entities.flatMap((candidate) => {
      if (candidateIdSet && !candidateIdSet.has(candidate.id)) return [];
      if (candidate.id === source.id) return [];
      const result = scoreRelatedContentCandidate(context, candidate);
      return result ? [result] : [];
    });
    scored.sort(
      (left, right) =>
        right.score - left.score || left.targetId.localeCompare(right.targetId),
    );
    return {
      generatedAt,
      partial: input.offline ? false : undefined,
      providerId: this.id,
      providerVersion: this.version,
      results: scored,
      revision: relatedContentCacheKey(input),
      stale: false,
    };
  },
};

function selectRelatedContent(
  input: RelatedContentProviderInput,
  provider: RelatedContentProvider = notesAppLocalRelatedContentProvider,
): RelatedContentState {
  const source = input.entities.find((entity) => entity.id === input.sourceId);
  if (!source) {
    return {
      kind: "unavailable",
      providerId: provider.id,
      providerVersion: provider.version,
      reason: "missing-source",
    };
  }
  if (!isRelatedContentEligible(source)) {
    return {
      kind: "unavailable",
      providerId: provider.id,
      providerVersion: provider.version,
      reason: "unsupported-source",
    };
  }
  const candidates = input.entities.filter(
    (entity) =>
      entity.id !== input.sourceId &&
      !isTrashedEntity(entity) &&
      isSameSpace(entity, input.spaceId),
  );
  if (candidates.length === 0) {
    return {
      kind: "unavailable",
      providerId: provider.id,
      providerVersion: provider.version,
      reason: "insufficient-candidates",
    };
  }
  try {
    const validated = validateRelatedContentResults(input, provider.rank(input));
    if (validated.results.length === 0) {
      return {
        generatedAt: validated.generatedAt,
        kind: "empty",
        partial: validated.partial,
        providerId: validated.providerId,
        providerVersion: validated.providerVersion,
        revision: validated.revision,
        stale: validated.stale,
      };
    }
    return {
      generatedAt: validated.generatedAt,
      kind: "ready",
      partial: validated.partial,
      providerId: validated.providerId,
      providerVersion: validated.providerVersion,
      results: validated.results,
      revision: validated.revision,
      stale: validated.stale,
    };
  } catch (error) {
    return {
      kind: "error",
      message: error instanceof Error ? error.message : "Related content failed.",
      providerId: provider.id,
      providerVersion: provider.version,
    };
  }
}

export type {
  RelatedContentProvider,
  RelatedContentProviderInput,
  RelatedContentProviderResult,
  RelatedContentReason,
  RelatedContentResult,
  RelatedContentState,
};
export {
  DEFAULT_RELATED_CONTENT_LIMIT,
  NOTES_APP_RELATED_CONTENT_PROVIDER_ID,
  NOTES_APP_RELATED_CONTENT_PROVIDER_VERSION,
  RELATED_CONTENT_PANEL_LIMIT,
  RelatedContentCache,
  isRelatedContentEligible,
  notesAppLocalRelatedContentProvider,
  relatedContentCacheKey,
  selectRelatedContent,
  validateRelatedContentResults,
};
