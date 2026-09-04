import type { KnowledgeDatabase } from "@/lib/db";
import { createCollectionId, createTagId } from "@/lib/workspace-domain-identities";
import {
  createCustomStructure,
  deleteStructure,
  instantiateObjectTypePreset,
  renameStructure,
  updateStructureAppearance,
  type CreateStructureInput,
  type ObjectIconName,
  type ObjectIconTone,
  type WorkspaceStructure,
} from "@/lib/workspace-object-types";
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
import {
  ACTIVE_SPACE_SETTING_ID,
  LOCAL_ACCOUNT_ID,
  PERSONAL_SPACE_ID,
} from "@/lib/spaces/space-types";

function stripSpaceId(record: SpaceObjectTypeRecord): WorkspaceStructure {
  const { spaceId: _spaceId, ...structure } = record;
  return structure;
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

  async function createEntity(spaceId: string, objectTypeId: string, title?: string) {
    await requireSpace(spaceId);
    const objectType = await database.objectTypes.get([spaceId, objectTypeId]);
    if (!objectType) throw new Error("Unknown object type in active Space.");
    const timestamp = new Date().toISOString();
    const entity: SpaceEntityRecord = {
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
    await database.entities.add(entity);
    return entity;
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
    createCollection,
    replaceCollections,
    createTag,
    assertSameSpaceEntityTargets,
    createRelation,
    putMedia,
    listMedia,
    setSpaceSetting,
    getSpaceSetting,
    listTrash,
    putTrash,
    deleteTrash,
  };
}

export { PERSONAL_SPACE_ID };
