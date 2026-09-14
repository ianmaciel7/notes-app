import type { SpaceRecord } from "@/lib/db/types";
import type { ObjectIconTone, SpaceIconName, SpaceStats } from "@/lib/space-object-types";
import type { SpaceDTO } from "@/types/dtos";
import type { ValidationResult } from "@/types/validation";

export type { SpaceDTO, SpaceIconName, SpaceRecord, SpaceStats, ValidationResult };

export interface CreateSpaceInput {
  name: string;
  description?: string;
  icon?: SpaceIconName;
  color?: ObjectIconTone;
}
