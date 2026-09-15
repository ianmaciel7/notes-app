import type * as React from 'react'
import type { ObjectIconName, ObjectIconProps } from '@/lib/space-object-types'
import { AiChatIcon } from './ai-chat-icon'
import { ArchiveIcon } from './archive-icon'
import { AreaIcon } from './area-icon'
import { AtomicNoteIcon } from './atomic-note-icon'
import { AudioIcon } from './audio-icon'
import { BookIcon } from './book-icon'
import { CodeIcon } from './code-icon'
import { CollectionIcon } from './collection-icon'
import { DailyNoteIcon } from './daily-note-icon'
import { DefinitionIcon } from './definition-icon'
import { FileIcon } from './file-icon'
import { FlashcardIcon } from './flashcard-icon'
import { IdeaIcon } from './idea-icon'
import { ImageIcon } from './image-icon'
import { KnowledgeIcon } from './knowledge-icon'
import { MediaIcon } from './media-icon'
import { MeetingIcon } from './meeting-icon'
import { OrganizationIcon } from './organization-icon'
import { PageIcon } from './page-icon'
import { PdfIcon } from './pdf-icon'
import { PersonIcon } from './person-icon'
import { PlaceIcon } from './place-icon'
import { ProjectIcon } from './project-icon'
import { QueryIcon } from './query-icon'
import { QuoteIcon } from './quote-icon'
import { StudyGoalIcon } from './study-goal-icon'
import { TableIcon } from './table-icon'
import { TagIcon } from './tag-icon'
import { TaskIcon } from './task-icon'
import { TravelIcon } from './travel-icon'
import { TweetIcon } from './tweet-icon'
import { WeblinkIcon } from './weblink-icon'

const objectIconRegistry: Record<
  string,
  React.ComponentType<ObjectIconProps>
> = {
  'ai-chat': AiChatIcon,
  archive: ArchiveIcon,
  area: AreaIcon,
  'atomic-note': AtomicNoteIcon,
  audio: AudioIcon,
  book: BookIcon,
  code: CodeIcon,
  collection: CollectionIcon,
  'daily-note': DailyNoteIcon,
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
  'study-goal': StudyGoalIcon,
  table: TableIcon,
  tag: TagIcon,
  task: TaskIcon,
  travel: TravelIcon,
  tweet: TweetIcon,
  weblink: WeblinkIcon,
  calendar: DailyNoteIcon,
  daily_note: DailyNoteIcon,
  study_goal: StudyGoalIcon,
  atomic_note: AtomicNoteIcon,
}

export function getObjectIcon(
  type: string,
): React.ComponentType<ObjectIconProps> {
  return objectIconRegistry[type.toLowerCase().trim()] ?? PageIcon
}

export function ObjectIcon({
  type,
  ...props
}: { type: ObjectIconName } & ObjectIconProps) {
  const Component = getObjectIcon(type)
  return <Component {...props} />
}
