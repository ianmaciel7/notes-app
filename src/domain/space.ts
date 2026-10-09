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
  | "not-found";

export class SpaceDeletionError extends Error {
  readonly code: SpaceDeletionErrorCode;

  constructor(code: SpaceDeletionErrorCode) {
    super(`Space deletion failed: ${code}.`);
    this.name = "SpaceDeletionError";
    this.code = code;
  }
}
