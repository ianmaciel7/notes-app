import type { ObjectIconTone, SpaceIconName } from "@/lib/space-object-types";

export interface UserDTO {
  readonly id: string;
  readonly accountId: string;
  readonly email?: string;
  readonly name?: string;
  readonly role: "user" | "admin";
}

export interface SpaceDTO {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly icon: SpaceIconName;
  readonly color: ObjectIconTone;
  readonly sortOrder: number;
  readonly isOwner: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface EntityDTO {
  readonly id: string;
  readonly spaceId: string;
  readonly objectTypeId: string;
  readonly type: string;
  readonly title: string;
  readonly icon?: string;
  readonly coverImage?: string;
  readonly tags: readonly string[];
  readonly inboxStatus?: string;
  readonly properties: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly updatedAt: string;
}
