import { BUILT_IN_STRUCTURES } from "@/lib/workspace-object-types";
import {
  LOCAL_ACCOUNT_ID,
  PERSONAL_SPACE_ID,
  type SpaceObjectTypeRecord,
  type SpaceRecord,
} from "@/lib/spaces/space-types";

export type PersonalSpaceSeed = {
  space: SpaceRecord;
  objectTypes: SpaceObjectTypeRecord[];
};

export function createPersonalSpaceSeed(
  now: () => Date = () => new Date(),
): PersonalSpaceSeed {
  const timestamp = now().toISOString();
  return {
    space: {
      id: PERSONAL_SPACE_ID,
      accountId: LOCAL_ACCOUNT_ID,
      name: "Personal Space",
      sortOrder: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    objectTypes: BUILT_IN_STRUCTURES.map((structure) => ({
      ...structuredClone(structure),
      spaceId: PERSONAL_SPACE_ID,
    })),
  };
}
