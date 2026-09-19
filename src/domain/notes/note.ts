export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

// NOTE: Zod is not yet used in this project. If Zod is added, replace this
// manual validation with a z.object() schema and .safeParse() call.
export function validateNoteInput(input: Partial<CreateNoteInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const title = input.title ?? "";
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.title = "Title is required";
  } else if (title.length > 200) {
    errors.title = "Title must not exceed 200 characters";
  }

  const content = input.content ?? "";
  if (typeof content !== "string") {
    errors.content = "Content is required";
  } else if (content.length > 50000) {
    errors.content = "Content must not exceed 50,000 characters";
  }

  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.tags = "Tags must be an array of strings";
    } else if (input.tags.length > 10) {
      errors.tags = "Maximum 10 tags allowed";
    } else if (input.tags.some((t) => typeof t !== "string" || t.length > 30)) {
      errors.tags = "Each tag must be a string with maximum 30 characters";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
