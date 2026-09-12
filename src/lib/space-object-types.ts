import type { ComponentPropsWithoutRef } from "react";

export type StructureId = string;
export type TagId = string;
export type CollectionId = string;

export type StructureOwnership = "built-in" | "custom" | "legacy" | "reserved";

export type StructureLifecycleKind =
  | "document"
  | "file"
  | "query"
  | "quote"
  | "table"
  | "tag"
  | "task"
  | "url";

export type ObjectIconProps = ComponentPropsWithoutRef<"svg">;

export type ObjectIconName =
  | "ai-chat"
  | "archive"
  | "area"
  | "atomic-note"
  | "audio"
  | "book"
  | "calendar"
  | "code"
  | "collection"
  | "daily-note"
  | "definition"
  | "file"
  | "flashcard"
  | "idea"
  | "image"
  | "knowledge"
  | "media"
  | "meeting"
  | "organization"
  | "page"
  | "pdf"
  | "person"
  | "place"
  | "project"
  | "query"
  | "quote"
  | "study-goal"
  | "table"
  | "tag"
  | "task"
  | "travel"
  | "tweet"
  | "weblink"
  // Legacy & snake_case aliases:
  | "atomic_note"
  | "daily_note"
  | "study_goal";

export type ObjectIconTone =
  | "amber"
  | "blue"
  | "cyan"
  | "emerald"
  | "fuchsia"
  | "gray"
  | "green"
  | "indigo"
  | "lime"
  | "neutral"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "rose"
  | "sky"
  | "teal"
  | "violet"
  | "yellow";
