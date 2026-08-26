import type { MediaAsset } from "./workspace-media-storage.ts";
import {
  createWorkspaceObjectLinkIndex,
  type WorkspaceObjectLinkIndex,
  type WorkspaceObjectReference,
} from "./workspace-object-links.ts";
import {
  executeQueryDefinition,
  type QueryDefinition,
} from "./workspace-object-views.ts";
import {
  createInitialWorkspaceObjectState,
  type WorkspaceEntity,
  type WorkspaceObjectState,
} from "./workspace-objects.ts";
import type { WorkspacePropertyValueMap } from "./workspace-property-values.ts";

type AccountId = string;
type SpaceId = string;
type SessionId = string;
type UserId = string;

type SessionCachePolicy = {
  readonly allowOfflineContent: boolean;
  readonly clearLocalContentOnSignOut: boolean;
  readonly remoteActionsRequireValidAuth: boolean;
};

type UserSession = {
  readonly accountId: AccountId;
  readonly expiresAt: string | null;
  readonly id: SessionId;
  readonly offlineCachePolicy: SessionCachePolicy;
  readonly provider: string;
  readonly status: "authenticated" | "expired" | "signed-out";
  readonly userId: UserId;
};

type AuthSecretHandle = {
  readonly id: string;
  readonly provider: string;
};

type AuthAdapter = {
  readonly provider: string;
  readonly getSession: () => Promise<UserSession | null>;
  readonly refreshSession: (
    session: UserSession,
  ) => Promise<UserSession | null>;
  readonly signOut: (session: UserSession) => Promise<void>;
};

type Space = {
  readonly accountId: AccountId;
  readonly createdAt: string;
  readonly id: SpaceId;
  readonly name: string;
  readonly updatedAt: string;
};

type WorkspaceOperation = {
  readonly id: string;
  readonly createdAt: string;
  readonly kind: string;
  readonly spaceId: SpaceId;
};

type WorkspaceSyncCursor = {
  readonly cursor: string;
  readonly scope: string;
  readonly spaceId: SpaceId;
  readonly updatedAt: string;
};

type SpaceRepository = {
  readonly mediaAssets: readonly MediaAsset[];
  readonly objectState: WorkspaceObjectState;
  readonly operations: readonly WorkspaceOperation[];
  readonly searchIndex: readonly SearchIndexRecord[];
  readonly syncCursors: readonly WorkspaceSyncCursor[];
};

type SpaceRecord = {
  readonly repository: SpaceRepository;
  readonly space: Space;
};

type ActiveSpaceState = {
  readonly activeSpaceId: SpaceId;
  readonly accountId: AccountId;
  readonly session: UserSession | null;
  readonly spaces: readonly SpaceRecord[];
};

type SearchIndexRecord = {
  readonly entityId: string;
  readonly spaceId: SpaceId;
  readonly text: string;
};

type SpaceDomainErrorCode =
  | "active-space-required"
  | "cross-space-reference"
  | "default-space-required"
  | "duplicate-space"
  | "last-space-delete"
  | "session-expired"
  | "unknown-space";

type SpaceDomainError = {
  readonly code: SpaceDomainErrorCode;
  readonly message: string;
};

type SpaceDomainResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly error: SpaceDomainError; readonly ok: false };

const DEFAULT_ACCOUNT_ID = "local-account";
const DEFAULT_SPACE_ID = "default-space";
const defaultSessionCachePolicy: SessionCachePolicy = {
  allowOfflineContent: true,
  clearLocalContentOnSignOut: false,
  remoteActionsRequireValidAuth: true,
};

function ok<T>(value: T): SpaceDomainResult<T> {
  return { ok: true, value };
}

function failure(
  code: SpaceDomainErrorCode,
  message: string,
): SpaceDomainResult<never> {
  return { error: { code, message }, ok: false };
}

function createDefaultSpace(
  accountId: AccountId = DEFAULT_ACCOUNT_ID,
  now: () => Date = () => new Date(),
): Space {
  const timestamp = now().toISOString();
  return {
    accountId,
    createdAt: timestamp,
    id: DEFAULT_SPACE_ID,
    name: "Personal",
    updatedAt: timestamp,
  };
}

function createEmptySpaceRepository(
  spaceId: SpaceId = DEFAULT_SPACE_ID,
  objectState: WorkspaceObjectState = createInitialWorkspaceObjectState(),
): SpaceRepository {
  return {
    mediaAssets: [],
    objectState,
    operations: [],
    searchIndex: createSearchIndex(spaceId, objectState.entities),
    syncCursors: [],
  };
}

function migrateSingleWorkspaceToDefaultSpace(
  objectState: WorkspaceObjectState,
  accountId: AccountId = DEFAULT_ACCOUNT_ID,
  now: () => Date = () => new Date(),
): ActiveSpaceState {
  const space = createDefaultSpace(accountId, now);
  return {
    accountId,
    activeSpaceId: space.id,
    session: null,
    spaces: [
      {
        repository: {
          ...createEmptySpaceRepository(space.id, objectState),
          searchIndex: createSearchIndex(space.id, objectState.entities),
        },
        space,
      },
    ],
  };
}

function createInitialActiveSpaceState(
  accountId: AccountId = DEFAULT_ACCOUNT_ID,
  now: () => Date = () => new Date(),
): ActiveSpaceState {
  return migrateSingleWorkspaceToDefaultSpace(
    createInitialWorkspaceObjectState(),
    accountId,
    now,
  );
}

function findSpaceRecord(
  state: ActiveSpaceState,
  spaceId: SpaceId,
): SpaceRecord | null {
  return state.spaces.find((record) => record.space.id === spaceId) ?? null;
}

function readActiveSpace(
  state: ActiveSpaceState,
): SpaceDomainResult<SpaceRecord> {
  const record = findSpaceRecord(state, state.activeSpaceId);
  return record
    ? ok(record)
    : failure("active-space-required", "The active Space is missing.");
}

function switchActiveSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
): SpaceDomainResult<ActiveSpaceState> {
  if (!findSpaceRecord(state, spaceId)) {
    return failure("unknown-space", `Unknown Space: ${spaceId}.`);
  }
  return ok({ ...state, activeSpaceId: spaceId });
}

function createSpace(
  state: ActiveSpaceState,
  input: { readonly id: SpaceId; readonly name: string },
  now: () => Date = () => new Date(),
): SpaceDomainResult<ActiveSpaceState> {
  const id = input.id.trim();
  const name = input.name.trim();
  if (!id || state.spaces.some((record) => record.space.id === id)) {
    return failure("duplicate-space", `Space id is unavailable: ${input.id}.`);
  }
  const timestamp = now().toISOString();
  return ok({
    ...state,
    activeSpaceId: id,
    spaces: [
      ...state.spaces,
      {
        repository: createEmptySpaceRepository(id),
        space: {
          accountId: state.accountId,
          createdAt: timestamp,
          id,
          name: name || "Untitled space",
          updatedAt: timestamp,
        },
      },
    ],
  });
}

function renameSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  name: string,
  now: () => Date = () => new Date(),
): SpaceDomainResult<ActiveSpaceState> {
  const record = findSpaceRecord(state, spaceId);
  if (!record) return failure("unknown-space", `Unknown Space: ${spaceId}.`);
  const nextName = name.trim();
  return ok({
    ...state,
    spaces: state.spaces.map((item) =>
      item.space.id === spaceId
        ? {
            ...item,
            space: {
              ...item.space,
              name: nextName || item.space.name,
              updatedAt: now().toISOString(),
            },
          }
        : item,
    ),
  });
}

function deleteSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  confirmSpaceName: string,
): SpaceDomainResult<ActiveSpaceState> {
  const record = findSpaceRecord(state, spaceId);
  if (!record) return failure("unknown-space", `Unknown Space: ${spaceId}.`);
  if (state.spaces.length === 1) {
    return failure("last-space-delete", "The last Space cannot be deleted.");
  }
  if (confirmSpaceName !== record.space.name) {
    return failure(
      "default-space-required",
      "Space deletion requires an exact name confirmation.",
    );
  }
  const spaces = state.spaces.filter((item) => item.space.id !== spaceId);
  return ok({
    ...state,
    activeSpaceId:
      state.activeSpaceId === spaceId
        ? (spaces[0]?.space.id ?? state.activeSpaceId)
        : state.activeSpaceId,
    spaces,
  });
}

function replaceSpaceRepository(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  repository: SpaceRepository,
): SpaceDomainResult<ActiveSpaceState> {
  if (!findSpaceRecord(state, spaceId)) {
    return failure("unknown-space", `Unknown Space: ${spaceId}.`);
  }
  return ok({
    ...state,
    spaces: state.spaces.map((record) =>
      record.space.id === spaceId ? { ...record, repository } : record,
    ),
  });
}

function resolveEntityInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  entityId: string,
): WorkspaceEntity | null {
  return (
    findSpaceRecord(state, spaceId)?.repository.objectState.entities.find(
      (entity) => entity.id === entityId,
    ) ?? null
  );
}

function selectEntitiesInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
): readonly WorkspaceEntity[] {
  return findSpaceRecord(state, spaceId)?.repository.objectState.entities ?? [];
}

function createSearchIndex(
  spaceId: SpaceId,
  entities: readonly WorkspaceEntity[],
): readonly SearchIndexRecord[] {
  return entities.map((entity) => ({
    entityId: entity.id,
    spaceId,
    text: [entity.title, entity.kind, entity.objectTypeId].join(" "),
  }));
}

function searchEntitiesInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  query: string,
): readonly WorkspaceEntity[] {
  const record = findSpaceRecord(state, spaceId);
  if (!record) return [];
  const normalized = query.trim().toLocaleLowerCase();
  const matchedIds = new Set(
    record.repository.searchIndex
      .filter(
        (entry) =>
          entry.spaceId === spaceId &&
          entry.text.toLocaleLowerCase().includes(normalized),
      )
      .map((entry) => entry.entityId),
  );
  return record.repository.objectState.entities.filter((entity) =>
    matchedIds.has(entity.id),
  );
}

function executeQueryInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  query: QueryDefinition,
): readonly WorkspaceEntity[] {
  return executeQueryDefinition(selectEntitiesInSpace(state, spaceId), query);
}

function createLinkIndexForSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
): WorkspaceObjectLinkIndex {
  return createWorkspaceObjectLinkIndex(selectEntitiesInSpace(state, spaceId));
}

function hasCrossSpaceReference(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  targetId: string,
): boolean {
  return state.spaces.some(
    (record) =>
      record.space.id !== spaceId &&
      record.repository.objectState.entities.some(
        (entity) => entity.id === targetId,
      ),
  );
}

function assertSameSpaceTarget(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  targetId: string,
): SpaceDomainResult<true> {
  if (resolveEntityInSpace(state, spaceId, targetId)) return ok(true);
  if (hasCrossSpaceReference(state, spaceId, targetId)) {
    return failure(
      "cross-space-reference",
      "Relation targets must belong to the active Space.",
    );
  }
  return failure("unknown-space", `Unknown Space target: ${targetId}.`);
}

function validateRelationTargetsInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  values: WorkspacePropertyValueMap,
): SpaceDomainResult<true> {
  for (const value of Object.values(values)) {
    if (value.type !== "entity") continue;
    for (const target of value.entity) {
      const sameSpace = assertSameSpaceTarget(state, spaceId, target.id);
      if (!sameSpace.ok) return sameSpace;
    }
  }
  return ok(true);
}

function validateContentReferencesInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  references: readonly WorkspaceObjectReference[],
): SpaceDomainResult<true> {
  for (const reference of references) {
    const sameSpace = assertSameSpaceTarget(state, spaceId, reference.targetId);
    if (!sameSpace.ok) return sameSpace;
  }
  return ok(true);
}

function readMediaAssetInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  assetId: string,
): MediaAsset | null {
  return (
    findSpaceRecord(state, spaceId)?.repository.mediaAssets.find(
      (asset) => asset.id === assetId,
    ) ?? null
  );
}

function readSyncCursorInSpace(
  state: ActiveSpaceState,
  spaceId: SpaceId,
  scope: string,
): WorkspaceSyncCursor | null {
  return (
    findSpaceRecord(state, spaceId)?.repository.syncCursors.find(
      (cursor) => cursor.spaceId === spaceId && cursor.scope === scope,
    ) ?? null
  );
}

function isSessionRemoteAuthorized(
  session: UserSession | null,
  now: () => Date = () => new Date(),
): boolean {
  if (session?.status !== "authenticated") return false;
  if (!session.expiresAt) return true;
  return Date.parse(session.expiresAt) > now().getTime();
}

function requireRemoteAuthorization(
  session: UserSession | null,
  now: () => Date = () => new Date(),
): SpaceDomainResult<true> {
  return isSessionRemoteAuthorized(session, now)
    ? ok(true)
    : failure("session-expired", "Remote actions require valid auth.");
}

function signOutSession(state: ActiveSpaceState): ActiveSpaceState {
  return {
    ...state,
    session: state.session ? { ...state.session, status: "signed-out" } : null,
  };
}

export type {
  AccountId,
  ActiveSpaceState,
  AuthAdapter,
  AuthSecretHandle,
  SearchIndexRecord,
  SessionCachePolicy,
  SessionId,
  Space,
  SpaceDomainError,
  SpaceDomainErrorCode,
  SpaceDomainResult,
  SpaceId,
  SpaceRecord,
  SpaceRepository,
  UserId,
  UserSession,
  WorkspaceOperation,
  WorkspaceSyncCursor,
};
export {
  assertSameSpaceTarget,
  createInitialActiveSpaceState,
  createLinkIndexForSpace,
  createSearchIndex,
  createSpace,
  DEFAULT_ACCOUNT_ID,
  DEFAULT_SPACE_ID,
  defaultSessionCachePolicy,
  deleteSpace,
  executeQueryInSpace,
  isSessionRemoteAuthorized,
  migrateSingleWorkspaceToDefaultSpace,
  readActiveSpace,
  readMediaAssetInSpace,
  readSyncCursorInSpace,
  renameSpace,
  replaceSpaceRepository,
  requireRemoteAuthorization,
  resolveEntityInSpace,
  searchEntitiesInSpace,
  selectEntitiesInSpace,
  signOutSession,
  switchActiveSpace,
  validateContentReferencesInSpace,
  validateRelationTargetsInSpace,
};
