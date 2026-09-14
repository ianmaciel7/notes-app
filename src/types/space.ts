import type { ObjectIconTone } from "@/lib/space-object-types";

export type SpaceIconName =
  | "folder"
  | "briefcase"
  | "book-open"
  | "code"
  | "brain"
  | "zap"
  | "user"
  | "sparkles"
  | "layers"
  | "globe"
  | "terminal"
  | "compass";

export interface SpaceRecord {
  id: string;
  name: string;
  description?: string;
  icon: SpaceIconName;
  color: ObjectIconTone;
  accountId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpaceStats {
  entityCount: number;
  noteCount: number;
  flashcardCount: number;
  fileCount: number;
}

export interface CreateSpaceInput {
  name: string;
  description?: string;
  icon?: SpaceIconName;
  color?: ObjectIconTone;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateCreateSpaceInput(input: unknown): ValidationResult<CreateSpaceInput> {
  if (!input || typeof input !== "object") {
    return { success: false, error: "Space input must be an object" };
  }

  const { name, description, icon, color } = input as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Space name is required and cannot be empty" };
  }

  if (name.trim().length > 50) {
    return { success: false, error: "Space name must not exceed 50 characters" };
  }

  if (description !== undefined && typeof description !== "string") {
    return { success: false, error: "Space description must be a string" };
  }

  if (description && description.length > 200) {
    return { success: false, error: "Space description must not exceed 200 characters" };
  }

  return {
    success: true,
    data: {
      name: name.trim(),
      description: description ? description.trim() : undefined,
      icon: (icon as SpaceIconName) || "folder",
      color: (color as ObjectIconTone) || "blue",
    },
  };
}
