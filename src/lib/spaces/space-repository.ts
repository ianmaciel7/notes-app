import type { KnowledgeDatabase } from "@/lib/db";
import { createCollectionId, createTagId } from "@/lib/space-domain-identities";
import { applyFSRSReview, createInitialSRSState, type FSRSRating } from "@/lib/srs/fsrs";
import {
  type CreateStructureInput,
  createCustomStructure,
  deleteStructure,
  instantiateObjectTypePreset,
  type ObjectIconName,
  type ObjectIconTone,
  renameStructure,
  updateStructureAppearance,
  type WorkspaceStructure,
} from "@/lib/space-object-types";
import type {
  SpaceCollectionRecord,
  SpaceEntityRecord,
  SpaceMediaRecord,
  SpaceObjectTypeRecord,
  SpaceRecord,
  SpaceRelationRecord,
  SpaceTagRecord,
  SpaceTrashRecord,
} from "@/lib/spaces/space-types";
import type { FlashcardEntity, StudyGoalEntity } from "@/types/schema";
import {
  ACTIVE_SPACE_SETTING_ID,
  LOCAL_ACCOUNT_ID,
  PERSONAL_SPACE_ID,
} from "@/lib/spaces/space-types";

export const PINNED_ENTITY_IDS_SETTING_KEY = "sidebar.pinnedEntityIds";

function stripSpaceId(record: SpaceObjectTypeRecord): WorkspaceStructure {
  const { spaceId: _spaceId, ...structure } = record;
  return structure;
}

function normalizePinnedEntityIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string" && id.trim().length > 0);
}

function isFlashcardRecord(
  entity: SpaceEntityRecord,
): entity is SpaceEntityRecord & FlashcardEntity {
  return entity.type === "flashcard" && typeof entity.srs === "object" && entity.srs !== null;
}

function createManualFlashcardRecord(
  base: SpaceEntityRecord,
): SpaceEntityRecord & FlashcardEntity {
  return {
    ...base,
    type: "flashcard",
    cardType: "basic",
    front: base.title,
    back: "",
    fileId: "manual",
    sourceHighlightId: "manual",
    sourceQuoteSnippet: "",
    srs: createInitialSRSState(new Date(base.createdAt)),
    aiGenerated: false,
  };
}

function createStudyGoalRecord(base: SpaceEntityRecord): SpaceEntityRecord & StudyGoalEntity {
  const targetExamDate = new Date(base.createdAt);
  targetExamDate.setDate(targetExamDate.getDate() + 30);

  return {
    ...base,
    type: "study_goal",
    targetExamDate: targetExamDate.toISOString(),
    targetRetentionRate: 0.9,
    totalCards: 0,
    dailyNewCardsQuota: 0,
    expectedDailyReviews: 0,
    targetFileIds: [],
  };
}

export function createSpaceRepository(database: KnowledgeDatabase) {
  async function requireSpace(spaceId: string) {
    const space = await database.spaces.get(spaceId);
    if (!space) throw new Error(`Unknown Space: ${spaceId}`);
    return space;
  }

  async function listSpaces() {
    return database.spaces.orderBy("sortOrder").toArray();
  }

  async function getActiveSpaceId() {
    return (await database.appSettings.get(ACTIVE_SPACE_SETTING_ID))?.value ?? null;
  }

  async function setActiveSpace(spaceId: string) {
    await requireSpace(spaceId);
    await database.appSettings.put({ id: ACTIVE_SPACE_SETTING_ID, value: spaceId });
  }

  async function createBlankSpace(name: string, now: () => Date = () => new Date()) {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error("Space name is required.");

    const timestamp = now().toISOString();
    const sortOrder = await database.spaces.count();
    const record: SpaceRecord = {
      id: `space-${crypto.randomUUID()}`,
      accountId: LOCAL_ACCOUNT_ID,
      name: normalizedName,
      sortOrder,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await database.transaction("rw", database.spaces, database.appSettings, async () => {
      await database.spaces.add(record);
      await database.appSettings.put({ id: ACTIVE_SPACE_SETTING_ID, value: record.id });
    });

    return record;
  }

  async function reorderSpaces(orderedIds: readonly string[]) {
    const current = await listSpaces();
    const currentIds = new Set(current.map((space) => space.id));
    if (
      orderedIds.length !== current.length ||
      new Set(orderedIds).size !== current.length ||
      orderedIds.some((id) => !currentIds.has(id))
    ) {
      throw new Error("Space order must contain every Space exactly once.");
    }

    await database.transaction("rw", database.spaces, async () => {
      await Promise.all(
        orderedIds.map((id, sortOrder) => database.spaces.update(id, { sortOrder })),
      );
    });
  }

  async function renameSpace(spaceId: string, name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error("Space name is required.");
    await requireSpace(spaceId);
    await database.spaces.update(spaceId, {
      name: normalizedName,
      updatedAt: new Date().toISOString(),
    });
  }

  async function deleteSpace(spaceId: string) {
    const spaces = await listSpaces();
    if (spaces.length <= 1) throw new Error("The last Space cannot be deleted.");
    await requireSpace(spaceId);
    const fallback = spaces.find((space) => space.id !== spaceId);
    if (!fallback) throw new Error("A fallback Space is required.");

    await database.transaction(
      "rw",
      [
        database.spaces,
        database.appSettings,
        database.objectTypes,
        database.entities,
        database.collections,
        database.tags,
        database.relations,
        database.media,
        database.spaceSettings,
        database.trash,
      ],
      async () => {
        await Promise.all([
          database.objectTypes.where("spaceId").equals(spaceId).delete(),
          database.entities.where("spaceId").equals(spaceId).delete(),
          database.collections.where("spaceId").equals(spaceId).delete(),
          database.tags.where("spaceId").equals(spaceId).delete(),
          database.relations.where("spaceId").equals(spaceId).delete(),
          database.media.where("spaceId").equals(spaceId).delete(),
          database.spaceSettings.where("spaceId").equals(spaceId).delete(),
          database.trash.where("spaceId").equals(spaceId).delete(),
        ]);
        await database.spaces.delete(spaceId);
        if ((await getActiveSpaceId()) === spaceId) {
          await database.appSettings.put({ id: ACTIVE_SPACE_SETTING_ID, value: fallback.id });
        }
      },
    );

    await reorderSpaces((await listSpaces()).map((space) => space.id));
  }

  function listObjectTypes(spaceId: string) {
    return database.objectTypes.where("spaceId").equals(spaceId).toArray();
  }

  async function replaceObjectTypes(spaceId: string, structures: readonly WorkspaceStructure[]) {
    await requireSpace(spaceId);
    await database.transaction("rw", database.objectTypes, async () => {
      await database.objectTypes.where("spaceId").equals(spaceId).delete();
      await database.objectTypes.bulkAdd(
        structures.map((structure) => ({ ...structuredClone(structure), spaceId })),
      );
    });
  }

  async function createObjectType(spaceId: string, input: CreateStructureInput) {
    const current = await listObjectTypes(spaceId);
    const result = createCustomStructure(current.map(stripSpaceId), input);
    if (!result.ok) throw new Error(result.error.message);
    await replaceObjectTypes(spaceId, result.value);
  }

  async function createObjectTypeFromPreset(spaceId: string, presetId: string) {
    const current = await listObjectTypes(spaceId);
    const result = instantiateObjectTypePreset(current.map(stripSpaceId), presetId);
    if (!result.ok) throw new Error(result.error.message);
    await replaceObjectTypes(spaceId, result.value);
  }

  async function updateObjectType(
    spaceId: string,
    objectTypeId: string,
    update: {
      singularName: string;
      pluralName: string;
      iconName?: ObjectIconName;
      tone?: ObjectIconTone;
    },
  ) {
    const current = await listObjectTypes(spaceId);
    const registry = current.map(stripSpaceId);
    const renamed = renameStructure(registry, objectTypeId, update.singularName, update.pluralName);
    if (!renamed.ok) throw new Error(renamed.error.message);
    const appeared = updateStructureAppearance(renamed.value, objectTypeId, {
      iconName: update.iconName,
      tone: update.tone,
    });
    if (!appeared.ok) throw new Error(appeared.error.message);
    await replaceObjectTypes(spaceId, appeared.value);
  }

  async function deleteObjectType(spaceId: string, objectTypeId: string) {
    const [current, instanceCount, dependentCollections] = await Promise.all([
      listObjectTypes(spaceId),
      database.entities.where("[spaceId+objectTypeId]").equals([spaceId, objectTypeId]).count(),
      database.collections.where("[spaceId+structureId]").equals([spaceId, objectTypeId]).toArray(),
    ]);
    const result = deleteStructure(current.map(stripSpaceId), objectTypeId, {
      instanceCount,
      dependentCollectionIds: dependentCollections.map((collection) => collection.id),
    });
    if (!result.ok) throw new Error(result.error.message);
    await replaceObjectTypes(spaceId, result.value);
  }

  function listEntities(spaceId: string) {
    return database.entities.where("spaceId").equals(spaceId).toArray();
  }

  async function updateEntity(
    spaceId: string,
    entityId: string,
    update: Partial<Omit<SpaceEntityRecord, "id" | "spaceId" | "objectTypeId" | "createdAt">> &
      Record<string, unknown>,
  ) {
    await requireSpace(spaceId);
    const entity = await database.entities.get([spaceId, entityId]);
    if (!entity) throw new Error("Entity not found.");
    const {
      id: _id,
      spaceId: _spaceId,
      objectTypeId: _objectTypeId,
      createdAt: _createdAt,
      ...editableUpdate
    } = structuredClone(update) as Partial<SpaceEntityRecord>;

    await database.entities.update([spaceId, entityId], {
      ...editableUpdate,
      updatedAt: new Date().toISOString(),
      _syncStatus: "pending",
    });

    return database.entities.get([spaceId, entityId]);
  }

  async function createEntity(spaceId: string, objectTypeId: string, title?: string) {
    await requireSpace(spaceId);
    const objectType = await database.objectTypes.get([spaceId, objectTypeId]);
    if (!objectType) throw new Error("Unknown object type in active Space.");
    const timestamp = new Date().toISOString();
    const baseEntity: SpaceEntityRecord = {
      id: `entity-${crypto.randomUUID()}`,
      spaceId,
      objectTypeId,
      type: objectTypeId,
      title: title?.trim() || `Untitled ${objectType.singularName}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      blocks: [],
      tags: [],
      relations: [],
      properties: {},
      _syncStatus: "pending",
    };
    const entity =
      objectTypeId === "flashcard"
        ? createManualFlashcardRecord(baseEntity)
        : objectTypeId === "study_goal"
          ? createStudyGoalRecord(baseEntity)
          : baseEntity;
    await database.entities.add(entity);
    return entity;
  }

  async function createFlashcardEntity(
    spaceId: string,
    input: {
      objectTypeId: string;
      title: string;
      front: string;
      back: string;
      fileId: string;
      sourceHighlightId: string;
      sourceQuoteSnippet: string;
      cardType?: "basic" | "cloze" | "reversed";
      clozeContent?: string;
      aiGenerated?: boolean;
      aiPromptContext?: string;
      referenceDate?: Date;
    },
  ) {
    await requireSpace(spaceId);
    const objectType = await database.objectTypes.get([spaceId, input.objectTypeId]);
    if (!objectType) throw new Error("Unknown object type in active Space.");

    const timestamp = (input.referenceDate ?? new Date()).toISOString();
    const record: SpaceEntityRecord & FlashcardEntity = {
      id: `flashcard-${crypto.randomUUID()}`,
      spaceId,
      objectTypeId: input.objectTypeId,
      type: "flashcard",
      title: input.title.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
      blocks: [],
      tags: [],
      relations: [],
      properties: {},
      cardType: input.cardType ?? "basic",
      front: input.front,
      back: input.back,
      fileId: input.fileId,
      sourceHighlightId: input.sourceHighlightId,
      sourceQuoteSnippet: input.sourceQuoteSnippet,
      clozeContent: input.clozeContent,
      srs: createInitialSRSState(new Date(timestamp)),
      aiGenerated: Boolean(input.aiGenerated),
      aiPromptContext: input.aiPromptContext,
      _syncStatus: "pending",
    };

    await database.entities.add(record);
    return record;
  }

  async function recordFlashcardReview(
    spaceId: string,
    flashcardId: string,
    rating: FSRSRating,
    reviewDate?: Date,
  ) {
    await requireSpace(spaceId);
    const entity = await database.entities.get([spaceId, flashcardId]);
    if (!entity) throw new Error("Flashcard not found.");
    if (!isFlashcardRecord(entity)) throw new Error("Target entity is not a flashcard.");
    if (!entity.srs) throw new Error("Flashcard has no SRS state.");

    const now = reviewDate ?? new Date();
    const { nextState, daysUntilDue } = applyFSRSReview({ card: entity.srs, now }, rating);

    await database.entities.update([spaceId, flashcardId], {
      updatedAt: now.toISOString(),
      srs: nextState,
    });

    return { entity, nextState, daysUntilDue };
  }

  async function createCollection(spaceId: string, structureId: string, name: string) {
    await requireSpace(spaceId);
    if (!(await database.objectTypes.get([spaceId, structureId]))) {
      throw new Error("Unknown object type in active Space.");
    }
    const existing = await database.collections.where("spaceId").equals(spaceId).toArray();
    const id = createCollectionId(structureId, name, new Set(existing.map((item) => item.id)));
    const record: SpaceCollectionRecord = { id, spaceId, structureId, name: name.trim() };
    await database.collections.add(record);
    return record;
  }

  async function replaceCollections(
    spaceId: string,
    records: Readonly<
      Record<string, Omit<SpaceCollectionRecord, "spaceId"> | SpaceCollectionRecord>
    >,
  ) {
    await requireSpace(spaceId);
    await database.transaction("rw", database.collections, async () => {
      await database.collections.where("spaceId").equals(spaceId).delete();
      const values = Object.values(records).map((record) => ({ ...record, spaceId }));
      if (values.length > 0) await database.collections.bulkAdd(values);
    });
  }

  async function createTag(spaceId: string, name: string) {
    await requireSpace(spaceId);
    const existing = await database.tags.where("spaceId").equals(spaceId).toArray();
    const id = createTagId(name, new Set(existing.map((item) => item.id)));
    const record: SpaceTagRecord = { id, spaceId, name: name.trim() };
    await database.tags.add(record);
    return record;
  }

  async function assertSameSpaceEntityTargets(spaceId: string, sourceId: string, targetId: string) {
    const [source, target] = await Promise.all([
      database.entities.get([spaceId, sourceId]),
      database.entities.get([spaceId, targetId]),
    ]);
    if (!source || !target) throw new Error("Cross-Space relation is not allowed.");
  }

  async function createRelation(record: SpaceRelationRecord) {
    await assertSameSpaceEntityTargets(record.spaceId, record.sourceId, record.targetId);
    await database.relations.add(record);
  }

  async function putMedia(spaceId: string, record: SpaceMediaRecord) {
    await requireSpace(spaceId);
    if (record.spaceId !== spaceId) throw new Error("Media Space mismatch.");
    await database.media.put(record);
  }

  function listMedia(spaceId: string) {
    return database.media.where("spaceId").equals(spaceId).toArray();
  }

  async function setSpaceSetting(spaceId: string, key: string, value: unknown) {
    await requireSpace(spaceId);
    const id = `setting:${spaceId}:${key}`;
    await database.spaceSettings.put({
      id,
      spaceId,
      key,
      value: structuredClone(value),
      updatedAt: new Date().toISOString(),
    });
  }

  async function getSpaceSetting(spaceId: string, key: string) {
    return (
      (await database.spaceSettings.get([spaceId, `setting:${spaceId}:${key}`]))?.value ?? null
    );
  }

  async function listPinnedEntityIds(spaceId: string) {
    await requireSpace(spaceId);
    const value = normalizePinnedEntityIds(
      await getSpaceSetting(spaceId, PINNED_ENTITY_IDS_SETTING_KEY),
    );
    if (value.length === 0) return [];

    const [entities, collections] = await Promise.all([
      database.entities.where("spaceId").equals(spaceId).toArray(),
      database.collections.where("spaceId").equals(spaceId).toArray(),
    ]);
    const validIds = new Set([
      ...entities.map((entity) => entity.id),
      ...collections.map((collection) => collection.id),
    ]);
    return value.filter((id, index) => value.indexOf(id) === index && validIds.has(id));
  }

  async function setPinnedEntityIds(spaceId: string, ids: readonly string[]) {
    await requireSpace(spaceId);
    const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);
    const [entities, collections] = await Promise.all([
      database.entities.where("spaceId").equals(spaceId).toArray(),
      database.collections.where("spaceId").equals(spaceId).toArray(),
    ]);
    const validIds = new Set([
      ...entities.map((entity) => entity.id),
      ...collections.map((collection) => collection.id),
    ]);
    await setSpaceSetting(
      spaceId,
      PINNED_ENTITY_IDS_SETTING_KEY,
      uniqueIds.filter((id) => validIds.has(id)),
    );
  }

  function listTrash(spaceId: string) {
    return database.trash.where("spaceId").equals(spaceId).toArray();
  }

  async function putTrash(spaceId: string, record: SpaceTrashRecord) {
    await requireSpace(spaceId);
    if (record.spaceId !== spaceId) throw new Error("Trash Space mismatch.");
    await database.trash.put(record);
  }

  async function deleteTrash(spaceId: string, id: string) {
    const record = await database.trash.get([spaceId, id]);
    if (!record) return;
    await database.trash.delete([spaceId, id]);
  }

  return {
    listSpaces,
    getActiveSpaceId,
    setActiveSpace,
    createBlankSpace,
    reorderSpaces,
    renameSpace,
    deleteSpace,
    listObjectTypes,
    replaceObjectTypes,
    createObjectType,
    createObjectTypeFromPreset,
    updateObjectType,
    deleteObjectType,
    listEntities,
    createEntity,
    updateEntity,
    createCollection,
    replaceCollections,
    createFlashcardEntity,
    recordFlashcardReview,
    createTag,
    assertSameSpaceEntityTargets,
    createRelation,
    putMedia,
    listMedia,
    setSpaceSetting,
    getSpaceSetting,
    listPinnedEntityIds,
    setPinnedEntityIds,
    listTrash,
    putTrash,
    deleteTrash,
  };
}

export { PERSONAL_SPACE_ID };
