import type * as React from "react";
import type { ObjectIconName } from "@/lib/space-object-types";
import { AiChatSplitButton } from "./ai-chat-split-button";
import { ArchiveSplitButton } from "./archive-split-button";
import { AreaSplitButton } from "./area-split-button";
import { AtomicNoteSplitButton } from "./atomic-note-split-button";
import { AudioSplitButton } from "./audio-split-button";
import { BookSplitButton } from "./book-split-button";
import { CodeSplitButton } from "./code-split-button";
import { CollectionSplitButton } from "./collection-split-button";
import { DailyNoteSplitButton } from "./daily-note-split-button";
import { DefinitionSplitButton } from "./definition-split-button";
import { FileSplitButton } from "./file-split-button";
import { FlashcardSplitButton } from "./flashcard-split-button";
import { IdeaSplitButton } from "./idea-split-button";
import { ImageSplitButton } from "./image-split-button";
import { KnowledgeSplitButton } from "./knowledge-split-button";
import { MediaSplitButton } from "./media-split-button";
import { MeetingSplitButton } from "./meeting-split-button";
import type { ObjectSplitButtonVariantProps } from "./object-split-button";
import { OrganizationSplitButton } from "./organization-split-button";
import { PageSplitButton } from "./page-split-button";
import { PdfSplitButton } from "./pdf-split-button";
import { PersonSplitButton } from "./person-split-button";
import { PlaceSplitButton } from "./place-split-button";
import { ProjectSplitButton } from "./project-split-button";
import { QuerySplitButton } from "./query-split-button";
import { QuoteSplitButton } from "./quote-split-button";
import { StudyGoalSplitButton } from "./study-goal-split-button";
import { TableSplitButton } from "./table-split-button";
import { TagSplitButton } from "./tag-split-button";
import { TaskSplitButton } from "./task-split-button";
import { TravelSplitButton } from "./travel-split-button";
import { TweetSplitButton } from "./tweet-split-button";
import { WeblinkSplitButton } from "./weblink-split-button";

export const objectSplitButtonRegistry: Record<
  string,
  React.ComponentType<ObjectSplitButtonVariantProps>
> & Record<ObjectIconName, React.ComponentType<ObjectSplitButtonVariantProps>> = {
  "ai-chat": AiChatSplitButton,
  archive: ArchiveSplitButton,
  area: AreaSplitButton,
  "atomic-note": AtomicNoteSplitButton,
  audio: AudioSplitButton,
  book: BookSplitButton,
  code: CodeSplitButton,
  collection: CollectionSplitButton,
  "daily-note": DailyNoteSplitButton,
  definition: DefinitionSplitButton,
  file: FileSplitButton,
  flashcard: FlashcardSplitButton,
  idea: IdeaSplitButton,
  image: ImageSplitButton,
  knowledge: KnowledgeSplitButton,
  media: MediaSplitButton,
  meeting: MeetingSplitButton,
  organization: OrganizationSplitButton,
  page: PageSplitButton,
  pdf: PdfSplitButton,
  person: PersonSplitButton,
  place: PlaceSplitButton,
  project: ProjectSplitButton,
  query: QuerySplitButton,
  quote: QuoteSplitButton,
  "study-goal": StudyGoalSplitButton,
  table: TableSplitButton,
  tag: TagSplitButton,
  task: TaskSplitButton,
  travel: TravelSplitButton,
  tweet: TweetSplitButton,
  weblink: WeblinkSplitButton,

  // Common aliases & snake_case identifiers
  calendar: DailyNoteSplitButton,
  daily_note: DailyNoteSplitButton,
  study_goal: StudyGoalSplitButton,
  atomic_note: AtomicNoteSplitButton,
};

export function getObjectSplitButton(
  type: string,
): React.ComponentType<ObjectSplitButtonVariantProps> {
  const normalized = type.toLowerCase().trim();
  return objectSplitButtonRegistry[normalized] ?? PageSplitButton;
}

export function ObjectSplitButtonDynamic({
  type,
  ...props
}: Omit<ObjectSplitButtonVariantProps, "type"> & { type: string }) {
  const Component = getObjectSplitButton(type);
  return <Component {...props} />;
}
