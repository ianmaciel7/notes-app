// Owner-scoped Spaces at /users/{uid}/spaces/{spaceId} (ADR 0010). SDK-free
// types and errors shared by the browser module, the server-only Data Access
// Layer, and Server Actions.

export type Space = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  icon: string;
  stateVersion: number;
  createdAt: Date;
  updatedAt: Date;
};

export type NewSpace = {
  name: string;
  description?: string;
  icon: string;
};

/** Fields the owner may change. `null` removes the description. */
export type SpaceChanges = {
  name?: string;
  description?: string | null;
  icon?: string;
};

/**
 * The write was based on a stale `stateVersion`. Carries what the user tried
 * to save and the current server state so the caller can resolve it.
 */
export class SpaceConflictError extends Error {
  readonly spaceId: string;
  readonly attempted: SpaceChanges;
  readonly current: Space;

  constructor(spaceId: string, attempted: SpaceChanges, current: Space) {
    super(`Space ${spaceId} changed since it was loaded.`);
    this.name = "SpaceConflictError";
    this.spaceId = spaceId;
    this.attempted = attempted;
    this.current = current;
  }
}

export type SpaceDeletionErrorCode =
  | "forbidden"
  | "has-descendants"
  | "invalid-id"
  | "not-found"
  | "unauthenticated";

/** Lowercase UUID v4 identifiers used for Spaces and Object Types. */
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * The only thing a deletion Server Action sends to the client: no records, no
 * identity, just the outcome (DTO, Next.js data security guide).
 */
export type SpaceDeletionResult =
  | { ok: true }
  | { ok: false; code: SpaceDeletionErrorCode };

export class SpaceDeletionError extends Error {
  readonly code: SpaceDeletionErrorCode;

  constructor(code: SpaceDeletionErrorCode) {
    super(`Space deletion failed: ${code}.`);
    this.name = "SpaceDeletionError";
    this.code = code;
  }
}

/** Rejects caller identities which cannot safely form an owner-scoped path. */
export function assertValidSpaceOwnerId(uid: string): void {
  if (typeof uid !== "string" || uid.trim().length === 0 || uid.includes("/")) {
    throw new SpaceDeletionError("invalid-id");
  }
}

/** Rejects any Space or Object Type identifier that is not a lowercase UUID v4. */
export function assertValidSpaceDeletionIds(...ids: string[]): void {
  if (!ids.every((id) => UUID_V4_PATTERN.test(id))) {
    throw new SpaceDeletionError("invalid-id");
  }
}
