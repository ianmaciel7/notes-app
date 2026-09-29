import type { CreateSpaceInput } from "@/types/space";

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export const ALLOWED_SPACE_ICONS = [
  "folder",
  "book",
  "briefcase",
  "code",
  "archive",
  "compass",
] as const;

export type AllowedSpaceIcon = (typeof ALLOWED_SPACE_ICONS)[number];

export function validateCreateSpaceInput(
  input: unknown,
): ValidationResult<CreateSpaceInput> {
  if (!input || typeof input !== "object") {
    return {
      success: false,
      error: "Invalid input payload",
    };
  }

  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const description =
    typeof raw.description === "string" ? raw.description.trim() : "";
  const icon = typeof raw.icon === "string" ? raw.icon.trim() : "folder";

  const fieldErrors: Record<string, string> = {};

  if (!name) {
    fieldErrors.name = "Space name is required";
  } else if (name.length > 50) {
    fieldErrors.name = "Space name must not exceed 50 characters";
  }

  if (description.length > 200) {
    fieldErrors.description = "Description must not exceed 200 characters";
  }

  if (icon && !ALLOWED_SPACE_ICONS.includes(icon as AllowedSpaceIcon)) {
    fieldErrors.icon = `Icon must be one of: ${ALLOWED_SPACE_ICONS.join(", ")}`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      name,
      description,
      icon: (icon as AllowedSpaceIcon) || "folder",
    },
  };
}
