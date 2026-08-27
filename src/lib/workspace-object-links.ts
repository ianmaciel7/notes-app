import {
  type BlockEditorMark,
  type BlockEditorNode,
  blockEditorDocumentToPlainText,
} from "../editor/document.ts";
import type { WorkspaceEntity } from "./workspace-objects.ts";

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
  missingReferences: WorkspaceBacklink[];
  referenceCountsByTargetId: Map<string, number>;
};

type UnlinkedMentionCandidate = {
  blockId?: string;
  label: string;
  sourceId: string;
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
): WorkspaceObjectLinkIndex {
  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
  const backlinksByTargetId = new Map<string, WorkspaceBacklink[]>();
  const forwardBySourceId = new Map<string, WorkspaceBacklink[]>();
  const graphEdges = new Map<string, WorkspaceGraphEdge>();
  const missingReferences: WorkspaceBacklink[] = [];

  for (const reference of selectForwardContentReferences(entities)) {
    const source = entitiesById.get(reference.sourceId);
    const target = entitiesById.get(reference.targetId);
    const backlink: WorkspaceBacklink = {
      ...reference,
      missing: !target,
      sourceTitle: source?.title ?? reference.sourceId,
      targetTitle: target?.title,
    };
    const targetBacklinks = backlinksByTargetId.get(reference.targetId) ?? [];
    targetBacklinks.push(backlink);
    backlinksByTargetId.set(reference.targetId, targetBacklinks);
    const sourceLinks = forwardBySourceId.get(reference.sourceId) ?? [];
    sourceLinks.push(backlink);
    forwardBySourceId.set(reference.sourceId, sourceLinks);
    if (!target) missingReferences.push(backlink);
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

function findUnlinkedMentionCandidates(
  entities: readonly WorkspaceEntity[],
  sourceId: string,
): UnlinkedMentionCandidate[] {
  const source = entities.find((entity) => entity.id === sourceId);
  if (!source || !isDocumentLikeEntity(source)) return [];
  const forwardTargets = new Set(
    selectForwardContentReferences([source]).map(
      (reference) => reference.targetId,
    ),
  );
  const plainText = normalizeMentionText(
    blockEditorDocumentToPlainText(source.body),
  );
  const candidates: UnlinkedMentionCandidate[] = [];
  for (const target of entities) {
    if (target.id === sourceId || forwardTargets.has(target.id)) continue;
    const labels = [
      target.title,
      ...("aliases" in target ? (target.aliases ?? []) : []),
    ]
      .map((label) => label.trim())
      .filter(Boolean);
    const label = labels.find((item) =>
      plainText.includes(normalizeMentionText(item)),
    );
    if (label) candidates.push({ label, sourceId, targetId: target.id });
  }
  return candidates;
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
