import type * as React from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { AiChatIcon } from '@/components/object/icons/ai-chat-icon'
import { ArchiveIcon } from '@/components/object/icons/archive-icon'
import { AreaIcon } from '@/components/object/icons/area-icon'
import { AtomicNoteIcon } from '@/components/object/icons/atomic-note-icon'
import { AudioIcon } from '@/components/object/icons/audio-icon'
import { BookIcon } from '@/components/object/icons/book-icon'
import { CodeIcon } from '@/components/object/icons/code-icon'
import { CollectionIcon } from '@/components/object/icons/collection-icon'
import { DailyNoteIcon } from '@/components/object/icons/daily-note-icon'
import { DefinitionIcon } from '@/components/object/icons/definition-icon'
import { FileIcon } from '@/components/object/icons/file-icon'
import { FlashcardIcon } from '@/components/object/icons/flashcard-icon'
import { IdeaIcon } from '@/components/object/icons/idea-icon'
import { ImageIcon } from '@/components/object/icons/image-icon'
import { KnowledgeIcon } from '@/components/object/icons/knowledge-icon'
import { MediaIcon } from '@/components/object/icons/media-icon'
import { MeetingIcon } from '@/components/object/icons/meeting-icon'
import { OrganizationIcon } from '@/components/object/icons/organization-icon'
import { PageIcon } from '@/components/object/icons/page-icon'
import { PdfIcon } from '@/components/object/icons/pdf-icon'
import { PersonIcon } from '@/components/object/icons/person-icon'
import { PlaceIcon } from '@/components/object/icons/place-icon'
import { ProjectIcon } from '@/components/object/icons/project-icon'
import { QueryIcon } from '@/components/object/icons/query-icon'
import { QuestionIcon } from '@/components/object/icons/question-icon'
import { QuoteIcon } from '@/components/object/icons/quote-icon'
import { StudyGoalIcon } from '@/components/object/icons/study-goal-icon'
import { TableIcon } from '@/components/object/icons/table-icon'
import { TagIcon } from '@/components/object/icons/tag-icon'
import { TaskIcon } from '@/components/object/icons/task-icon'
import { TravelIcon } from '@/components/object/icons/travel-icon'
import { TweetIcon } from '@/components/object/icons/tweet-icon'
import { WeblinkIcon } from '@/components/object/icons/weblink-icon'

export type StructureId = string
export type TagId = string
export type CollectionId = string

export type StructureOwnership = 'built-in' | 'custom' | 'legacy' | 'reserved'

export type StructureLifecycleKind =
  | 'document'
  | 'file'
  | 'query'
  | 'quote'
  | 'table'
  | 'tag'
  | 'task'
  | 'url'

export type ObjectIconProps = ComponentPropsWithoutRef<'svg'>

export type ObjectIconName =
  | 'ai-chat'
  | 'archive'
  | 'area'
  | 'atomic-note'
  | 'audio'
  | 'book'
  | 'calendar'
  | 'code'
  | 'collection'
  | 'daily-note'
  | 'definition'
  | 'file'
  | 'flashcard'
  | 'idea'
  | 'image'
  | 'knowledge'
  | 'media'
  | 'meeting'
  | 'organization'
  | 'page'
  | 'pdf'
  | 'person'
  | 'place'
  | 'project'
  | 'query'
  | 'question'
  | 'quote'
  | 'study-goal'
  | 'table'
  | 'tag'
  | 'task'
  | 'travel'
  | 'tweet'
  | 'weblink'
  | 'atomic_note'
  | 'daily_note'
  | 'study_goal'

export type ObjectIconTone =
  | 'amber'
  | 'blue'
  | 'cyan'
  | 'emerald'
  | 'fuchsia'
  | 'gray'
  | 'green'
  | 'indigo'
  | 'lime'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'rose'
  | 'sky'
  | 'teal'
  | 'violet'
  | 'yellow'

export type SpaceIconName =
  | 'folder'
  | 'briefcase'
  | 'book-open'
  | 'code'
  | 'brain'
  | 'zap'
  | 'user'
  | 'sparkles'
  | 'layers'
  | 'globe'
  | 'terminal'
  | 'compass'

export interface SpaceStats {
  readonly entityCount: number
  readonly noteCount: number
  readonly flashcardCount: number
  readonly fileCount: number
}

export const objectIconMap: Record<
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
  question: QuestionIcon,
  quote: QuoteIcon,
  'study-goal': StudyGoalIcon,
  table: TableIcon,
  tag: TagIcon,
  task: TaskIcon,
  travel: TravelIcon,
  tweet: TweetIcon,
  weblink: WeblinkIcon,
}

export function getObjectIcon(type: ObjectIconName) {
  return objectIconMap[type.toLowerCase().trim()] ?? PageIcon
}
