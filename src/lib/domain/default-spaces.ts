import type { SpaceRecord } from "./records";

export const LOCAL_ACCOUNT_ID = "local-account";
export const PERSONAL_SPACE_ID = "personal-space";
export const ENGINEERING_SPACE_ID = "engineering-space";
export const ACTIVE_SPACE_SETTING_ID = "activeSpaceId";

export const DEFAULT_SPACES: readonly SpaceRecord[] = [
  {
    id: PERSONAL_SPACE_ID,
    name: "Personal Space",
    description: "Personal notes, daily logs, journal, and knowledge capture.",
    icon: "user",
    color: "blue",
    accountId: LOCAL_ACCOUNT_ID,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: ENGINEERING_SPACE_ID,
    name: "Engineering & Arch",
    description: "Architecture decisions, code patterns, specs, and systems research.",
    icon: "code",
    color: "emerald",
    accountId: LOCAL_ACCOUNT_ID,
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];
