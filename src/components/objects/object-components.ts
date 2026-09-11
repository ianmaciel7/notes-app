import type { ComponentType } from "react";
import type {
  ObjectTypeDetailProps,
  ObjectTypeListProps,
} from "@/components/objects/object-view-types";
import { AiChatDetail } from "@/components/objects/types/ai-chat/ai-chat-detail";
import { AiChatList } from "@/components/objects/types/ai-chat/ai-chat-list";
import { AreaDetail } from "@/components/objects/types/area/area-detail";
import { AreaList } from "@/components/objects/types/area/area-list";
import { AtomicNoteDetail } from "@/components/objects/types/atomic-note/atomic-note-detail";
import { AtomicNoteList } from "@/components/objects/types/atomic-note/atomic-note-list";
import { AudioDetail } from "@/components/objects/types/audio/audio-detail";
import { AudioList } from "@/components/objects/types/audio/audio-list";
import { BookDetail } from "@/components/objects/types/book/book-detail";
import { BookList } from "@/components/objects/types/book/book-list";
import { CustomObjectDetail } from "@/components/objects/types/custom-object/custom-object-detail";
import { CustomObjectList } from "@/components/objects/types/custom-object/custom-object-list";
import { DefinitionDetail } from "@/components/objects/types/definition/definition-detail";
import { DefinitionList } from "@/components/objects/types/definition/definition-list";
import { FileDetail } from "@/components/objects/types/file/file-detail";
import { FileList } from "@/components/objects/types/file/file-list";
import { FlashcardDetail } from "@/components/objects/types/flashcard/flashcard-detail";
import { FlashcardList } from "@/components/objects/types/flashcard/flashcard-list";
import { IdeaDetail } from "@/components/objects/types/idea/idea-detail";
import { IdeaList } from "@/components/objects/types/idea/idea-list";
import { ImageDetail } from "@/components/objects/types/image/image-detail";
import { ImageList } from "@/components/objects/types/image/image-list";
import { MediaDetail } from "@/components/objects/types/media/media-detail";
import { MediaList } from "@/components/objects/types/media/media-list";
import { MeetingDetail } from "@/components/objects/types/meeting/meeting-detail";
import { MeetingList } from "@/components/objects/types/meeting/meeting-list";
import { OrganizationDetail } from "@/components/objects/types/organization/organization-detail";
import { OrganizationList } from "@/components/objects/types/organization/organization-list";
import { PageDetail } from "@/components/objects/types/page/page-detail";
import { PageList } from "@/components/objects/types/page/page-list";
import { PdfDetail } from "@/components/objects/types/pdf/pdf-detail";
import { PdfList } from "@/components/objects/types/pdf/pdf-list";
import { PersonDetail } from "@/components/objects/types/person/person-detail";
import { PersonList } from "@/components/objects/types/person/person-list";
import { PlaceDetail } from "@/components/objects/types/place/place-detail";
import { PlaceList } from "@/components/objects/types/place/place-list";
import { ProjectDetail } from "@/components/objects/types/project/project-detail";
import { ProjectList } from "@/components/objects/types/project/project-list";
import { QueryDetail } from "@/components/objects/types/query/query-detail";
import { QueryList } from "@/components/objects/types/query/query-list";
import { QuoteDetail } from "@/components/objects/types/quote/quote-detail";
import { QuoteList } from "@/components/objects/types/quote/quote-list";
import { StudyGoalDetail } from "@/components/objects/types/study-goal/study-goal-detail";
import { StudyGoalList } from "@/components/objects/types/study-goal/study-goal-list";
import { TableDetail } from "@/components/objects/types/table/table-detail";
import { TableList } from "@/components/objects/types/table/table-list";
import { TagDetail } from "@/components/objects/types/tag/tag-detail";
import { TagList } from "@/components/objects/types/tag/tag-list";
import { TaskDetail } from "@/components/objects/types/task/task-detail";
import { TaskList } from "@/components/objects/types/task/task-list";
import { TravelDetail } from "@/components/objects/types/travel/travel-detail";
import { TravelList } from "@/components/objects/types/travel/travel-list";
import { TweetDetail } from "@/components/objects/types/tweet/tweet-detail";
import { TweetList } from "@/components/objects/types/tweet/tweet-list";
import { WeblinkDetail } from "@/components/objects/types/weblink/weblink-detail";
import { WeblinkList } from "@/components/objects/types/weblink/weblink-list";

type ObjectComponents = {
  List: ComponentType<ObjectTypeListProps>;
  Detail: ComponentType<ObjectTypeDetailProps>;
};

const customComponents: ObjectComponents = { List: CustomObjectList, Detail: CustomObjectDetail };

const objectComponents = new Map<string, ObjectComponents>([
  ["page", { List: PageList, Detail: PageDetail }],
  ["table", { List: TableList, Detail: TableDetail }],
  ["task", { List: TaskList, Detail: TaskDetail }],
  ["flashcard", { List: FlashcardList, Detail: FlashcardDetail }],
  ["study_goal", { List: StudyGoalList, Detail: StudyGoalDetail }],
  ["weblink", { List: WeblinkList, Detail: WeblinkDetail }],
  ["image", { List: ImageList, Detail: ImageDetail }],
  ["pdf", { List: PdfList, Detail: PdfDetail }],
  ["audio", { List: AudioList, Detail: AudioDetail }],
  ["file", { List: FileList, Detail: FileDetail }],
  ["tweet", { List: TweetList, Detail: TweetDetail }],
  ["ai-chat", { List: AiChatList, Detail: AiChatDetail }],
  ["tag", { List: TagList, Detail: TagDetail }],
  ["query", { List: QueryList, Detail: QueryDetail }],
  ["book", { List: BookList, Detail: BookDetail }],
  ["person", { List: PersonList, Detail: PersonDetail }],
  ["area", { List: AreaList, Detail: AreaDetail }],
  ["meeting", { List: MeetingList, Detail: MeetingDetail }],
  ["definition", { List: DefinitionList, Detail: DefinitionDetail }],
  ["idea", { List: IdeaList, Detail: IdeaDetail }],
  ["place", { List: PlaceList, Detail: PlaceDetail }],
  ["project", { List: ProjectList, Detail: ProjectDetail }],
  ["organization", { List: OrganizationList, Detail: OrganizationDetail }],
  ["media", { List: MediaList, Detail: MediaDetail }],
  ["travel", { List: TravelList, Detail: TravelDetail }],
  ["quote", { List: QuoteList, Detail: QuoteDetail }],
  ["atomic-note", { List: AtomicNoteList, Detail: AtomicNoteDetail }],
]);

export function resolveObjectComponents(kind: string): ObjectComponents {
  return objectComponents.get(kind) ?? customComponents;
}
