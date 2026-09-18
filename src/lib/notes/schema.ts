import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

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

export function validateCreateNoteInput(input: Partial<CreateNoteInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (
    !input.title ||
    typeof input.title !== "string" ||
    input.title.trim().length === 0
  ) {
    errors.title = "Title is required";
  } else if (input.title.length > 200) {
    errors.title = "Title must not exceed 200 characters";
  }

  if (input.content === undefined || typeof input.content !== "string") {
    errors.content = "Content is required";
  } else if (input.content.length > 50000) {
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

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateNoteInput(input: UpdateNoteInput): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (input.title !== undefined) {
    if (typeof input.title !== "string" || input.title.trim().length === 0) {
      errors.title = "Title must not be empty";
    } else if (input.title.length > 200) {
      errors.title = "Title must not exceed 200 characters";
    }
  }

  if (input.content !== undefined) {
    if (typeof input.content !== "string") {
      errors.content = "Content must be a string";
    } else if (input.content.length > 50000) {
      errors.content = "Content must not exceed 50,000 characters";
    }
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

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateNoteInput(input: Partial<CreateNoteInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  return validateCreateNoteInput({
    title: input.title ?? "",
    content: input.content ?? "",
    tags: input.tags,
  });
}

export const noteConverter: FirestoreDataConverter<Note> = {
  toFirestore(note: Note): DocumentData {
    const data: DocumentData = {
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
    if (note.tags !== undefined) {
      data.tags = note.tags;
    }
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Note {
    const data = snapshot.data(options);
    const createdAt = (data.createdAt as Timestamp)?.toDate
      ? (data.createdAt as Timestamp).toDate()
      : new Date(data.createdAt);
    const updatedAt = (data.updatedAt as Timestamp)?.toDate
      ? (data.updatedAt as Timestamp).toDate()
      : new Date(data.updatedAt);

    return {
      id: snapshot.id,
      title: data.title ?? "",
      content: data.content ?? "",
      createdAt,
      updatedAt,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
    };
  },
};
