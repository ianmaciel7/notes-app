import type { ComponentType } from "react";
import type {
  ObjectTypeDetailProps,
  ObjectTypeListProps,
} from "@/app/_components/objects/object-view-types";
import { AiChatDetail } from "@/app/_components/objects/types/ai-chat/ai-chat-detail";
import { AiChatList } from "@/app/_components/objects/types/ai-chat/ai-chat-list";
import { AreaDetail } from "@/app/_components/objects/types/area/area-detail";
import { AreaList } from "@/app/_components/objects/types/area/area-list";
import { AtomicNoteDetail } from "@/app/_components/objects/types/atomic-note/atomic-note-detail";
import { AtomicNoteList } from "@/app/_components/objects/types/atomic-note/atomic-note-list";
import { AudioDetail } from "@/app/_components/objects/types/audio/audio-detail";
import { AudioList } from "@/app/_components/objects/types/audio/audio-list";
import { BookDetail } from "@/app/_components/objects/types/book/book-detail";
import { BookList } from "@/app/_components/objects/types/book/book-list";
import { CustomObjectDetail } from "@/app/_components/objects/types/custom-object/custom-object-detail";
import { CustomObjectList } from "@/app/_components/objects/types/custom-object/custom-object-list";
import { DefinitionDetail } from "@/app/_components/objects/types/definition/definition-detail";
import { DefinitionList } from "@/app/_components/objects/types/definition/definition-list";
import { FileDetail } from "@/app/_components/objects/types/file/file-detail";
import { FileList } from "@/app/_components/objects/types/file/file-list";
import { FlashcardDetail } from "@/app/_components/objects/types/flashcard/flashcard-detail";
import { FlashcardList } from "@/app/_components/objects/types/flashcard/flashcard-list";
import { IdeaDetail } from "@/app/_components/objects/types/idea/idea-detail";
import { IdeaList } from "@/app/_components/objects/types/idea/idea-list";
import { ImageDetail } from "@/app/_components/objects/types/image/image-detail";
import { ImageList } from "@/app/_components/objects/types/image/image-list";
import { MediaDetail } from "@/app/_components/objects/types/media/media-detail";
import { MediaList } from "@/app/_components/objects/types/media/media-list";
import { MeetingDetail } from "@/app/_components/objects/types/meeting/meeting-detail";
import { MeetingList } from "@/app/_components/objects/types/meeting/meeting-list";
import { OrganizationDetail } from "@/app/_components/objects/types/organization/organization-detail";
import { OrganizationList } from "@/app/_components/objects/types/organization/organization-list";
import { PageDetail } from "@/app/_components/objects/types/page/page-detail";
import { PageList } from "@/app/_components/objects/types/page/page-list";
import { PdfDetail } from "@/app/_components/objects/types/pdf/pdf-detail";
import { PdfList } from "@/app/_components/objects/types/pdf/pdf-list";
import { PersonDetail } from "@/app/_components/objects/types/person/person-detail";
import { PersonList } from "@/app/_components/objects/types/person/person-list";
import { PlaceDetail } from "@/app/_components/objects/types/place/place-detail";
import { PlaceList } from "@/app/_components/objects/types/place/place-list";
import { ProjectDetail } from "@/app/_components/objects/types/project/project-detail";
import { ProjectList } from "@/app/_components/objects/types/project/project-list";
import { QueryDetail } from "@/app/_components/objects/types/query/query-detail";
import { QueryList } from "@/app/_components/objects/types/query/query-list";
import { QuoteDetail } from "@/app/_components/objects/types/quote/quote-detail";
import { QuoteList } from "@/app/_components/objects/types/quote/quote-list";
import { StudyGoalDetail } from "@/app/_components/objects/types/study-goal/study-goal-detail";
import { StudyGoalList } from "@/app/_components/objects/types/study-goal/study-goal-list";
import { TableDetail } from "@/app/_components/objects/types/table/table-detail";
import { TableList } from "@/app/_components/objects/types/table/table-list";
import { TagDetail } from "@/app/_components/objects/types/tag/tag-detail";
import { TagList } from "@/app/_components/objects/types/tag/tag-list";
import { TaskDetail } from "@/app/_components/objects/types/task/task-detail";
import { TaskList } from "@/app/_components/objects/types/task/task-list";
import { TravelDetail } from "@/app/_components/objects/types/travel/travel-detail";
import { TravelList } from "@/app/_components/objects/types/travel/travel-list";
import { TweetDetail } from "@/app/_components/objects/types/tweet/tweet-detail";
import { TweetList } from "@/app/_components/objects/types/tweet/tweet-list";
import { WeblinkDetail } from "@/app/_components/objects/types/weblink/weblink-detail";
import { WeblinkList } from "@/app/_components/objects/types/weblink/weblink-list";

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
