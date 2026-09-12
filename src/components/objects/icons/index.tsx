import type * as React from "react";

export * from "./ai-chat-icon";
export * from "./archive-icon";
export * from "./area-icon";
export * from "./atomic-note-icon";
export * from "./audio-icon";
export * from "./book-icon";
export * from "./code-icon";
export * from "./collection-icon";
export * from "./daily-note-icon";
export * from "./definition-icon";
export * from "./file-icon";
export * from "./flashcard-icon";
export * from "./icon-base";
export * from "./idea-icon";
export * from "./image-icon";
export * from "./knowledge-icon";
export * from "./media-icon";
export * from "./meeting-icon";
export * from "./organization-icon";
export * from "./page-icon";
export * from "./pdf-icon";
export * from "./person-icon";
export * from "./place-icon";
export * from "./project-icon";
export * from "./query-icon";
export * from "./quote-icon";
export * from "./study-goal-icon";
export * from "./table-icon";
export * from "./tag-icon";
export * from "./task-icon";
export * from "./travel-icon";
export * from "./tweet-icon";
export * from "./types";
export * from "./weblink-icon";

import { AiChatIcon } from "./ai-chat-icon";
import { ArchiveIcon } from "./archive-icon";
import { AreaIcon } from "./area-icon";
import { AtomicNoteIcon } from "./atomic-note-icon";
import { AudioIcon } from "./audio-icon";
import { BookIcon } from "./book-icon";
import { CodeIcon } from "./code-icon";
import { CollectionIcon } from "./collection-icon";
import { DailyNoteIcon } from "./daily-note-icon";
import { DefinitionIcon } from "./definition-icon";
import { FileIcon } from "./file-icon";
import { FlashcardIcon } from "./flashcard-icon";
import { IdeaIcon } from "./idea-icon";
import { ImageIcon } from "./image-icon";
import { KnowledgeIcon } from "./knowledge-icon";
import { MediaIcon } from "./media-icon";
import { MeetingIcon } from "./meeting-icon";
import { OrganizationIcon } from "./organization-icon";
import { PageIcon } from "./page-icon";
import { PdfIcon } from "./pdf-icon";
import { PersonIcon } from "./person-icon";
import { PlaceIcon } from "./place-icon";
import { ProjectIcon } from "./project-icon";
import { QueryIcon } from "./query-icon";
import { QuoteIcon } from "./quote-icon";
import { StudyGoalIcon } from "./study-goal-icon";
import { TableIcon } from "./table-icon";
import { TagIcon } from "./tag-icon";
import { TaskIcon } from "./task-icon";
import { TravelIcon } from "./travel-icon";
import { TweetIcon } from "./tweet-icon";
import type { ObjectIconProps } from "./types";
import { WeblinkIcon } from "./weblink-icon";

export const objectIconRegistry: Record<string, React.ComponentType<ObjectIconProps>> = {
  "ai-chat": AiChatIcon,
  archive: ArchiveIcon,
  area: AreaIcon,
  "atomic-note": AtomicNoteIcon,
  audio: AudioIcon,
  book: BookIcon,
  code: CodeIcon,
  collection: CollectionIcon,
  "daily-note": DailyNoteIcon,
  definition: DefinitionIcon,
  file: FileIcon,
  flashcard: FlashcardIcon,
  idea: IdeaIcon,
  image: ImageIcon,
  knowledge: KnowledgeIcon,
  media: MediaIcon,
  meeting: MeetingIcon,
  organization: OrganizationIcon,
  page: PageIcon,
  pdf: PdfIcon,
  person: PersonIcon,
  place: PlaceIcon,
  project: ProjectIcon,
  query: QueryIcon,
  quote: QuoteIcon,
  "study-goal": StudyGoalIcon,
  table: TableIcon,
  tag: TagIcon,
  task: TaskIcon,
  travel: TravelIcon,
  tweet: TweetIcon,
  weblink: WeblinkIcon,

  // Common aliases & snake_case identifiers
  calendar: DailyNoteIcon,
  daily_note: DailyNoteIcon,
  study_goal: StudyGoalIcon,
  atomic_note: AtomicNoteIcon,
};

export function getObjectIcon(type: string): React.ComponentType<ObjectIconProps> {
  const normalized = type.toLowerCase().trim();
  return objectIconRegistry[normalized] ?? PageIcon;
}

export function ObjectIcon({ type, ...props }: { type: string } & ObjectIconProps) {
  const Component = getObjectIcon(type);
  return <Component {...props} />;
}
