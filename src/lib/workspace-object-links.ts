import type {
  BlockEditorDocument,
  BlockEditorMark,
  BlockEditorNode,
} from "../editor/document.ts";
import type { TrashRecord, WorkspaceEntity } from "./workspace-objects.ts";

type WorkspaceObjectReferenceKind = "block" | "embed" | "object";

type WorkspaceObjectReference = {
  blockId?: string;
  kind: WorkspaceObjectReferenceKind;
  sourceId: string;
  targetBlockId?: string;
  targetId: string;
};

type WorkspaceBacklink = WorkspaceObjectReference & {
  missing: boolean;
  sourceTitle: string;
  targetTitle?: string;
};

type WorkspaceGraphEdge = {
  id: string;
  from: string;
  kind: WorkspaceObjectReferenceKind | "property";
  to: string;
};

type WorkspaceObjectLinkIndex = {
  backlinksByTargetId: Map<string, WorkspaceBacklink[]>;
  forwardBySourceId: Map<string, WorkspaceBacklink[]>;
  graphEdges: WorkspaceGraphEdge[];
  missingTargets: readonly {
    readonly reason: "missing" | "trashed";
    readonly targetId: string;
  }[];
  missingReferences: WorkspaceBacklink[];
  referenceCountsByTargetId: Map<string, number>;
};

type UnlinkedMentionCandidate = {
  blockId?: string;
  end: number;
  excerpt: string;
  label: string;
  sourceId: string;
  start: number;
  targetId: string;
};

type WorkspaceRelatedEntityRule =
  | "backlink"
  | "content-reference"
  | "property-relation"
  | "shared-collection";

type WorkspaceRelatedEntity = {
  entity: WorkspaceEntity;
  rules: readonly WorkspaceRelatedEntityRule[];
};

function isDocumentLikeEntity(
  entity: WorkspaceEntity,
): entity is Extract<WorkspaceEntity, { kind: "document" | "quote" }> {
  return entity.kind === "document" || entity.kind === "quote";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function referenceKey(reference: WorkspaceObjectReference) {
  return [
    reference.sourceId,
    reference.blockId ?? "",
    reference.kind,
    reference.targetId,
    reference.targetBlockId ?? "",
  ].join("\u001f");
}

function getBlockId(node: BlockEditorNode): string | undefined {
  const id = node.attrs?.id;
  return typeof id === "string" && id.trim() ? id : undefined;
}

function referenceFromMark(
  sourceId: string,
  blockId: string | undefined,
  mark: BlockEditorMark,
): WorkspaceObjectReference | null {
  if (mark.type === "objectLink") {
    return { blockId, kind: "object", sourceId, targetId: mark.attrs.objectId };
  }
  if (mark.type === "blockLink") {
    return {
      blockId,
      kind: "block",
      sourceId,
      targetBlockId: mark.attrs.blockId,
      targetId: mark.attrs.objectId,
    };
  }
  if (mark.type !== "link") return null;
  const objectMatch = mark.attrs.href.match(/^object:([A-Za-z0-9_.:-]+)$/);
  if (objectMatch?.[1]) {
    return { blockId, kind: "object", sourceId, targetId: objectMatch[1] };
  }
  const blockMatch = mark.attrs.href.match(
    /^block:([A-Za-z0-9_.:-]+)#([A-Za-z0-9_.:-]+)$/,
  );
  if (!blockMatch?.[1] || !blockMatch[2]) return null;
  return {
    blockId,
    kind: "block",
    sourceId,
    targetBlockId: blockMatch[2],
    targetId: blockMatch[1],
  };
}

function collectReferencesFromNode(
  sourceId: string,
  node: BlockEditorNode,
  inheritedBlockId: string | undefined,
  references: WorkspaceObjectReference[],
) {
  const blockId = getBlockId(node) ?? inheritedBlockId;
  for (const mark of node.marks ?? []) {
    const reference = referenceFromMark(sourceId, blockId, mark);
    if (reference) references.push(reference);
  }
  if (node.type === "objectEmbed" && isRecord(node.attrs)) {
    const objectId = node.attrs.objectId;
    if (typeof objectId === "string") {
      references.push({ blockId, kind: "embed", sourceId, targetId: objectId });
    }
  }
  for (const child of node.content ?? []) {
    collectReferencesFromNode(sourceId, child, blockId, references);
  }
}

function selectForwardContentReferences(
  entities: readonly WorkspaceEntity[],
): WorkspaceObjectReference[] {
  const references: WorkspaceObjectReference[] = [];
  for (const entity of entities) {
    if (!isDocumentLikeEntity(entity)) continue;
    for (const node of entity.body.doc.content) {
      collectReferencesFromNode(entity.id, node, undefined, references);
    }
  }
  const unique = new Map<string, WorkspaceObjectReference>();
  for (const reference of references) {
    unique.set(referenceKey(reference), reference);
  }
  return Array.from(unique.values());
}

function createWorkspaceObjectLinkIndex(
  entities: readonly WorkspaceEntity[],
  trashRecords: readonly TrashRecord[] = [],
): WorkspaceObjectLinkIndex {
  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
  const trashedIds = new Set(trashRecords.map((record) => record.entityId));
  const backlinksByTargetId = new Map<string, WorkspaceBacklink[]>();
  const forwardBySourceId = new Map<string, WorkspaceBacklink[]>();
  const graphEdges = new Map<string, WorkspaceGraphEdge>();
  const missingTargets = new Map<
    string,
    { readonly reason: "missing" | "trashed"; readonly targetId: string }
  >();
  const missingReferences: WorkspaceBacklink[] = [];

  for (const reference of selectForwardContentReferences(entities)) {
    const source = entitiesById.get(reference.sourceId);
    const target = entitiesById.get(reference.targetId);
    const missing = !target || trashedIds.has(reference.targetId);
    const backlink: WorkspaceBacklink = {
      ...reference,
      missing,
      sourceTitle: source?.title ?? reference.sourceId,
      targetTitle: target?.title,
    };
    const targetBacklinks = backlinksByTargetId.get(reference.targetId) ?? [];
    targetBacklinks.push(backlink);
    backlinksByTargetId.set(reference.targetId, targetBacklinks);
    const sourceLinks = forwardBySourceId.get(reference.sourceId) ?? [];
    sourceLinks.push(backlink);
    forwardBySourceId.set(reference.sourceId, sourceLinks);
    if (missing) {
      missingReferences.push(backlink);
      missingTargets.set(reference.targetId, {
        reason: trashedIds.has(reference.targetId) ? "trashed" : "missing",
        targetId: reference.targetId,
      });
    }
    const edgeId = `${reference.sourceId}->${reference.targetId}:${reference.kind}`;
    graphEdges.set(edgeId, {
      from: reference.sourceId,
      id: edgeId,
      kind: reference.kind,
      to: reference.targetId,
    });
  }

  return {
    backlinksByTargetId,
    forwardBySourceId,
    graphEdges: Array.from(graphEdges.values()),
    missingTargets: Array.from(missingTargets.values()),
    missingReferences,
    referenceCountsByTargetId: new Map(
      Array.from(backlinksByTargetId, ([targetId, backlinks]) => [
        targetId,
        backlinks.length,
      ]),
    ),
  };
}

function selectBacklinksForObject(
  index: WorkspaceObjectLinkIndex,
  objectId: string,
): WorkspaceBacklink[] {
  return index.backlinksByTargetId.get(objectId) ?? [];
}

function selectObjectsInside(
  index: WorkspaceObjectLinkIndex,
  sourceId: string,
): WorkspaceBacklink[] {
  const references = index.forwardBySourceId.get(sourceId) ?? [];
  const uniqueReferences = new Map<string, WorkspaceBacklink>();
  for (const reference of references) {
    if (!uniqueReferences.has(reference.targetId)) {
      uniqueReferences.set(reference.targetId, reference);
    }
  }
  return Array.from(uniqueReferences.values());
}

function selectContextualGraphEdges(
  index: WorkspaceObjectLinkIndex,
  focusId: string,
): WorkspaceGraphEdge[] {
  return index.graphEdges.filter(
    (edge) => edge.from === focusId || edge.to === focusId,
  );
}

function selectPropertyRelationGraphEdges(
  entities: readonly WorkspaceEntity[],
): WorkspaceGraphEdge[] {
  const edges = new Map<string, WorkspaceGraphEdge>();
  for (const entity of entities) {
    for (const [propertyId, record] of Object.entries(entity.propertyValues)) {
      if (record.type !== "entity") continue;
      for (const value of record.entity) {
        if (!value.id.trim()) continue;
        const id = `${entity.id}->${value.id}:property:${propertyId}`;
        edges.set(id, { from: entity.id, id, kind: "property", to: value.id });
      }
    }
  }
  return Array.from(edges.values());
}

function collectionIds(entity: WorkspaceEntity): readonly string[] {
  return "collections" in entity && Array.isArray(entity.collections)
    ? entity.collections
    : [];
}

function selectRelatedEntities(
  entities: readonly WorkspaceEntity[],
  objectId: string,
): WorkspaceRelatedEntity[] {
  const source = entities.find((entity) => entity.id === objectId);
  if (!source) return [];

  const rulesByEntityId = new Map<string, Set<WorkspaceRelatedEntityRule>>();
  const add = (id: string, rule: WorkspaceRelatedEntityRule) => {
    if (id === objectId || !entities.some((entity) => entity.id === id)) return;
    const rules =
      rulesByEntityId.get(id) ?? new Set<WorkspaceRelatedEntityRule>();
    rules.add(rule);
    rulesByEntityId.set(id, rules);
  };
  const index = createWorkspaceObjectLinkIndex(entities);

  for (const backlink of selectBacklinksForObject(index, objectId)) {
    add(backlink.sourceId, "backlink");
  }
  for (const reference of selectObjectsInside(index, objectId)) {
    add(reference.targetId, "content-reference");
  }
  for (const edge of selectPropertyRelationGraphEdges(entities)) {
    if (edge.from === objectId) add(edge.to, "property-relation");
    if (edge.to === objectId) add(edge.from, "property-relation");
  }

  const sourceCollections = new Set(collectionIds(source));
  if (sourceCollections.size > 0) {
    for (const entity of entities) {
      if (collectionIds(entity).some((id) => sourceCollections.has(id))) {
        add(entity.id, "shared-collection");
      }
    }
  }

  return entities.flatMap((entity) => {
    const rules = rulesByEntityId.get(entity.id);
    return rules ? [{ entity, rules: Array.from(rules) }] : [];
  });
}

function normalizeMentionText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function mentionNodeText(node: BlockEditorNode): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(mentionNodeText).join("");
}

const mentionWordCharacter = /[\p{L}\p{N}_]/u;

function findMentionStart(text: string, label: string, fromIndex = 0): number {
  let start = text.indexOf(label, fromIndex);
  while (start >= 0) {
    const end = start + label.length;
    const startsWithWord = mentionWordCharacter.test(label[0] ?? "");
    const endsWithWord = mentionWordCharacter.test(label.at(-1) ?? "");
    const beforeIsWord = mentionWordCharacter.test(text[start - 1] ?? "");
    const afterIsWord = mentionWordCharacter.test(text[end] ?? "");
    if ((!startsWithWord || !beforeIsWord) && (!endsWithWord || !afterIsWord)) {
      return start;
    }
    start = text.indexOf(label, start + Math.max(label.length, 1));
  }
  return -1;
}

type MentionRange = { end: number; start: number };

function collectLinkedMentionRanges(
  node: BlockEditorNode,
  targetId: string,
  offset: { value: number },
  ranges: MentionRange[],
) {
  if (node.type === "text") {
    const start = offset.value;
    const end = start + (node.text?.length ?? 0);
    const linksToTarget = (node.marks ?? []).some(
      (mark) => referenceFromMark("", undefined, mark)?.targetId === targetId,
    );
    if (linksToTarget) ranges.push({ end, start });
    offset.value = end;
    return;
  }
  for (const child of node.content ?? []) {
    collectLinkedMentionRanges(child, targetId, offset, ranges);
  }
}

function findUnlinkedMentionCandidates(
  entities: readonly WorkspaceEntity[],
  targetId: string,
): UnlinkedMentionCandidate[] {
  const target = entities.find((entity) => entity.id === targetId);
  if (!target) return [];
  const labels = [
    target.title,
    ...("aliases" in target ? (target.aliases ?? []) : []),
  ]
    .map((label) => label.trim())
    .filter(Boolean);
  if (labels.length === 0) return [];
  const candidates: UnlinkedMentionCandidate[] = [];
  const seenRanges = new Set<string>();
  for (const source of entities) {
    if (source.id === targetId || !isDocumentLikeEntity(source)) continue;
    for (const block of source.body.doc.content) {
      const excerpt = mentionNodeText(block);
      const normalizedExcerpt = normalizeMentionText(excerpt);
      const linkedRanges: MentionRange[] = [];
      collectLinkedMentionRanges(
        block,
        targetId,
        { value: 0 },
        linkedRanges,
      );
      for (const candidateLabel of labels) {
        const normalizedLabel = normalizeMentionText(candidateLabel);
        let candidateStart = findMentionStart(normalizedExcerpt, normalizedLabel);
        while (candidateStart >= 0) {
          const candidateEnd = candidateStart + normalizedLabel.length;
          const overlapsLinkedRange = linkedRanges.some(
            (range) => candidateStart < range.end && candidateEnd > range.start,
          );
          const rangeKey = `${source.id}\u001f${getBlockId(block) ?? ""}\u001f${candidateStart}\u001f${candidateEnd}`;
          if (!overlapsLinkedRange && !seenRanges.has(rangeKey)) {
            seenRanges.add(rangeKey);
            candidates.push({
              blockId: getBlockId(block),
              end: candidateEnd,
              excerpt,
              label: candidateLabel,
              sourceId: source.id,
              start: candidateStart,
              targetId,
            });
          }
          candidateStart = findMentionStart(
            normalizedExcerpt,
            normalizedLabel,
            candidateEnd,
          );
        }
      }
    }
  }
  return candidates;
}

function convertMentionNode(
  node: BlockEditorNode,
  candidate: UnlinkedMentionCandidate,
  offset: { value: number },
): BlockEditorNode[] {
  if (node.type === "text") {
    const text = node.text ?? "";
    const nodeStart = offset.value;
    const nodeEnd = nodeStart + text.length;
    offset.value = nodeEnd;
    const matchStart = Math.max(candidate.start, nodeStart);
    const matchEnd = Math.min(candidate.end, nodeEnd);
    if (matchStart >= matchEnd) return [node];
    const localStart = matchStart - nodeStart;
    const localEnd = matchEnd - nodeStart;
    const parts: BlockEditorNode[] = [];
    if (localStart > 0) {
      parts.push({ ...node, text: text.slice(0, localStart) });
    }
    parts.push({
      ...node,
      marks: [
        ...(node.marks ?? []),
        createObjectReferenceMark(candidate.targetId),
      ],
      text: text.slice(localStart, localEnd),
    });
    if (localEnd < text.length) {
      parts.push({ ...node, text: text.slice(localEnd) });
    }
    return parts;
  }
  if (!node.content) return [node];
  return [
    {
      ...node,
      content: node.content.flatMap((child) =>
        convertMentionNode(child, candidate, offset),
      ),
    },
  ];
}

function convertUnlinkedMentionCandidate(
  document: BlockEditorDocument,
  candidate: UnlinkedMentionCandidate | undefined,
): BlockEditorDocument | null {
  if (!candidate?.blockId) return null;
  const blockIndex = document.doc.content.findIndex(
    (block) => getBlockId(block) === candidate.blockId,
  );
  if (blockIndex < 0) return null;
  const block = document.doc.content[blockIndex];
  const text = mentionNodeText(block);
  const selected = text.slice(candidate.start, candidate.end);
  if (
    text !== candidate.excerpt ||
    normalizeMentionText(selected) !== normalizeMentionText(candidate.label)
  ) {
    return null;
  }
  const converted = convertMentionNode(block, candidate, { value: 0 })[0];
  return {
    ...document,
    doc: {
      ...document.doc,
      content: document.doc.content.map((item, index) =>
        index === blockIndex ? converted : item,
      ),
    },
  };
}

function wouldCreateReferenceCycle(
  references: readonly WorkspaceObjectReference[],
  sourceId: string,
  targetId: string,
) {
  const outgoing = new Map<string, Set<string>>();
  for (const reference of references) {
    const targets = outgoing.get(reference.sourceId) ?? new Set<string>();
    targets.add(reference.targetId);
    outgoing.set(reference.sourceId, targets);
  }
  const targets = outgoing.get(sourceId) ?? new Set<string>();
  targets.add(targetId);
  outgoing.set(sourceId, targets);

  const visited = new Set<string>();
  const stack = [targetId];
  while (stack.length) {
    const current = stack.pop();
    if (!current || visited.has(current)) continue;
    if (current === sourceId) return true;
    visited.add(current);
    for (const next of outgoing.get(current) ?? []) stack.push(next);
  }
  return false;
}

function createBlockReferenceMark(
  objectId: string,
  blockId: string,
): BlockEditorMark {
  return { type: "blockLink", attrs: { blockId, objectId } };
}

function createObjectReferenceMark(objectId: string): BlockEditorMark {
  return { type: "objectLink", attrs: { objectId } };
}

function createObjectEmbedNode(objectId: string): BlockEditorNode {
  return { type: "objectEmbed", attrs: { objectId } };
}

export type {
  UnlinkedMentionCandidate,
  WorkspaceBacklink,
  WorkspaceGraphEdge,
  WorkspaceObjectLinkIndex,
  WorkspaceObjectReference,
  WorkspaceRelatedEntity,
  WorkspaceRelatedEntityRule,
};
export {
  convertUnlinkedMentionCandidate,
  createBlockReferenceMark,
  createObjectEmbedNode,
  createObjectReferenceMark,
  createWorkspaceObjectLinkIndex,
  findUnlinkedMentionCandidates,
  selectBacklinksForObject,
  selectContextualGraphEdges,
  selectForwardContentReferences,
  selectObjectsInside,
  selectPropertyRelationGraphEdges,
  selectRelatedEntities,
  wouldCreateReferenceCycle,
};
