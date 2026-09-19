import { DomainError } from "@/domain/shared/domain-error";

export type SpaceObjectType = "question" | "exam" | "collection";
export type ObjectLifecycle = "draft" | "published" | "archived";

export interface ObjectRecord {
  id: string;
  spaceId: string;
  ownerId: string;
  type: SpaceObjectType;
  title: string;
  lifecycle: ObjectLifecycle;
  latestRevisionId: string;
  publishedRevisionId?: string;
  schemaVersion: 1;
  createdAt: string;
  updatedAt: string;
}

export interface ObjectRevision<TPayload> {
  id: string;
  objectId: string;
  objectType: SpaceObjectType;
  version: number;
  publicationState: "draft" | "published";
  payload: TPayload;
  schemaVersion: 1;
  createdBy: string;
  createdAt: string;
}

const ALLOWED_TRANSITIONS: Record<ObjectLifecycle, ObjectLifecycle[]> = {
  draft: ["published"],
  published: ["archived"],
  archived: ["draft"],
};

export function assertLifecycleTransition(
  from: ObjectLifecycle,
  to: ObjectLifecycle,
): void {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new DomainError("lifecycle-conflict", {
      message: `Transition from "${from}" to "${to}" is not permitted.`,
    });
  }
}
