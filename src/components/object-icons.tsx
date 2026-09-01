import type { Icon, IconProps } from "@phosphor-icons/react";
import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import { BookmarkSimpleIcon } from "@phosphor-icons/react/dist/csr/BookmarkSimple";
import { BookOpenIcon } from "@phosphor-icons/react/dist/csr/BookOpen";
import { BrainIcon } from "@phosphor-icons/react/dist/csr/Brain";
import { BuildingsIcon } from "@phosphor-icons/react/dist/csr/Buildings";
import { ChatsIcon } from "@phosphor-icons/react/dist/csr/Chats";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { CubeIcon } from "@phosphor-icons/react/dist/csr/Cube";
import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { FilePdfIcon } from "@phosphor-icons/react/dist/csr/FilePdf";
import { FileTextIcon } from "@phosphor-icons/react/dist/csr/FileText";
import { GlobeHemisphereWestIcon } from "@phosphor-icons/react/dist/csr/GlobeHemisphereWest";
import { ImageIcon } from "@phosphor-icons/react/dist/csr/Image";
import { LightbulbIcon } from "@phosphor-icons/react/dist/csr/Lightbulb";
import { ListMagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/ListMagnifyingGlass";
import { MapPinIcon } from "@phosphor-icons/react/dist/csr/MapPin";
import { MonitorPlayIcon } from "@phosphor-icons/react/dist/csr/MonitorPlay";
import { QuotesIcon } from "@phosphor-icons/react/dist/csr/Quotes";
import { SquareIcon } from "@phosphor-icons/react/dist/csr/Square";
import { StackIcon } from "@phosphor-icons/react/dist/csr/Stack";
import { SuitcaseRollingIcon } from "@phosphor-icons/react/dist/csr/SuitcaseRolling";
import { TableIcon } from "@phosphor-icons/react/dist/csr/Table";
import { TagIcon } from "@phosphor-icons/react/dist/csr/Tag";
import { TwitterLogoIcon } from "@phosphor-icons/react/dist/csr/TwitterLogo";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import { UsersIcon } from "@phosphor-icons/react/dist/csr/Users";
import { WaveformIcon } from "@phosphor-icons/react/dist/csr/Waveform";
import type { ComponentPropsWithoutRef, ElementType } from "react";

import type {
  ObjectIconTone,
  ObjectIconName as PersistedObjectIconName,
} from "@/lib/workspace-object-types";

type ObjectIconProps = Omit<IconProps, "name" | "weight">;
type ObjectTypeDefinition = {
  id: string;
  label: string;
  icon: ElementType<ObjectIconProps>;
  tone: ObjectIconTone;
};

type ObjectIconBadgeProps = ComponentPropsWithoutRef<"span"> & {
  icon: ElementType<ObjectIconProps>;
  tone: ObjectIconTone;
  iconClassName?: string;
  variant?: "default" | "menu" | "sidebar";
};

const objectIconToneTextClass: Record<ObjectIconTone, string> = {
  amber: "text-[oklch(0.5708_0.1192_59.46)]",
  blue: "text-[oklch(0.5035_0.1579_264.41)]",
  cyan: "text-[oklch(0.4954_0.0774_186.74)]",
  emerald: "text-[oklch(0.4933_0.0939_167.09)]",
  gray: "text-[oklch(0.4289_0.0021_324.71)]",
  green: "text-[oklch(0.5327_0.1221_151.70)]",
  orange: "text-[oklch(0.5570_0.1387_43.21)]",
  purple: "text-[oklch(0.5047_0.2017_295.51)]",
  red: "text-[oklch(0.5060_0.1552_24.58)]",
  rose: "text-[oklch(0.5096_0.1640_12.19)]",
  sky: "text-[oklch(0.4914_0.0976_237.18)]",
};

const objectIconToneBadgeClass: Record<ObjectIconTone, string> = {
  amber:
    "border-[oklch(0.8790_0.1533_91.61)] bg-[oklch(0.9746_0.0399_94.73)] text-[oklch(0.5708_0.1192_59.46)]",
  blue: "border-[oklch(0.8091_0.0957_251.83)] bg-[oklch(0.9513_0.0235_256.13)] text-[oklch(0.5035_0.1579_264.41)]",
  cyan: "border-[oklch(0.8549_0.1251_181.11)] bg-[oklch(0.9678_0.0321_182.40)] text-[oklch(0.4954_0.0774_186.74)]",
  emerald:
    "border-[oklch(0.8452_0.1299_165.01)] bg-[oklch(0.9660_0.0361_163.39)] text-[oklch(0.4933_0.0939_167.09)]",
  gray: "border-[oklch(0.8643_0.0017_67.13)] bg-[oklch(0.9766_0.0016_67.01)] text-[oklch(0.4289_0.0021_324.71)]",
  green:
    "border-[oklch(0.8712_0.1363_154.48)] bg-[oklch(0.9732_0.0311_157.36)] text-[oklch(0.5327_0.1221_151.70)]",
  orange:
    "border-[oklch(0.8366_0.1165_66.28)] bg-[oklch(0.9668_0.0264_74.74)] text-[oklch(0.5570_0.1387_43.21)]",
  purple:
    "border-[oklch(0.8112_0.1014_293.55)] bg-[oklch(0.9564_0.0229_293.96)] text-[oklch(0.5047_0.2017_295.51)]",
  red: "border-[oklch(0.8077_0.1035_19.54)] bg-[oklch(0.9530_0.0218_17.35)] text-[oklch(0.5060_0.1552_24.58)]",
  rose: "border-[oklch(0.8097_0.1061_11.61)] bg-[oklch(0.9563_0.0218_13.86)] text-[oklch(0.5096_0.1640_12.19)]",
  sky: "border-[oklch(0.8276_0.1013_230.34)] bg-[oklch(0.9654_0.0192_235.84)] text-[oklch(0.4914_0.0976_237.18)]",
};

type ObjectIconName = PersistedObjectIconName | "code" | "knowledge";

const phosphorObjectIcon: Record<ObjectIconName, Icon> = {
  "ai-chat": ChatsIcon,
  archive: ArchiveIcon,
  area: SquareIcon,
  "atomic-note": StackIcon,
  audio: WaveformIcon,
  book: BookOpenIcon,
  code: CodeIcon,
  definition: BookmarkSimpleIcon,
  file: FileIcon,
  idea: LightbulbIcon,
  image: ImageIcon,
  knowledge: BrainIcon,
  media: MonitorPlayIcon,
  meeting: UsersIcon,
  organization: BuildingsIcon,
  page: FileTextIcon,
  pdf: FilePdfIcon,
  person: UserIcon,
  place: MapPinIcon,
  project: CubeIcon,
  query: ListMagnifyingGlassIcon,
  quote: QuotesIcon,
  table: TableIcon,
  tag: TagIcon,
  task: CheckCircleIcon,
  travel: SuitcaseRollingIcon,
  tweet: TwitterLogoIcon,
  weblink: GlobeHemisphereWestIcon,
};

function createObjectIcon(name: ObjectIconName) {
  const PhosphorIcon = phosphorObjectIcon[name];

  function ObjectIcon({ className, ...props }: ObjectIconProps) {
    return (
      <PhosphorIcon
        data-slot="object-icon"
        data-icon-name={name}
        weight="regular"
        aria-hidden="true"
        className={className}
        {...props}
      />
    );
  }

  return ObjectIcon;
}

const ObjectBookIcon = createObjectIcon("book");
const ObjectPersonIcon = createObjectIcon("person");
const ObjectAreaIcon = createObjectIcon("area");
const ObjectMeetingIcon = createObjectIcon("meeting");
const ObjectQuoteIcon = createObjectIcon("quote");
const ObjectDefinitionIcon = createObjectIcon("definition");
const ObjectIdeaIcon = createObjectIcon("idea");
const ObjectPlaceIcon = createObjectIcon("place");
const ObjectProjectIcon = createObjectIcon("project");
const ObjectOrganizationIcon = createObjectIcon("organization");
const ObjectAtomicNoteIcon = createObjectIcon("atomic-note");
const ObjectMediaIcon = createObjectIcon("media");
const ObjectTravelIcon = createObjectIcon("travel");
const ObjectPageIcon = createObjectIcon("page");
const ObjectTagIcon = createObjectIcon("tag");
const ObjectImageIcon = createObjectIcon("image");
const ObjectWeblinkIcon = createObjectIcon("weblink");
const ObjectPdfIcon = createObjectIcon("pdf");
const ObjectAudioIcon = createObjectIcon("audio");
const ObjectFileIcon = createObjectIcon("file");
const ObjectTweetIcon = createObjectIcon("tweet");
const ObjectAiChatIcon = createObjectIcon("ai-chat");
const ObjectTableIcon = createObjectIcon("table");
const ObjectTaskIcon = createObjectIcon("task");
const ObjectQueryIcon = createObjectIcon("query");
const ObjectArchiveIcon = createObjectIcon("archive");
const ObjectCodeIcon = createObjectIcon("code");
const ObjectKnowledgeIcon = createObjectIcon("knowledge");
const ObjectCollectionIcon = ObjectAtomicNoteIcon;

const objectTypeDefinitions: ObjectTypeDefinition[] = [
  { id: "book", label: "Book", icon: ObjectBookIcon, tone: "purple" },
  { id: "person", label: "Person", icon: ObjectPersonIcon, tone: "orange" },
  { id: "area", label: "Area", icon: ObjectAreaIcon, tone: "blue" },
  { id: "meeting", label: "Meeting", icon: ObjectMeetingIcon, tone: "red" },
  { id: "quote", label: "Quote", icon: ObjectQuoteIcon, tone: "rose" },
  {
    id: "definition",
    label: "Definition",
    icon: ObjectDefinitionIcon,
    tone: "purple",
  },
  { id: "idea", label: "Idea", icon: ObjectIdeaIcon, tone: "amber" },
  { id: "place", label: "Place", icon: ObjectPlaceIcon, tone: "emerald" },
  { id: "project", label: "Project", icon: ObjectProjectIcon, tone: "emerald" },
  {
    id: "organization",
    label: "Organization",
    icon: ObjectOrganizationIcon,
    tone: "red",
  },
  {
    id: "atomic-note",
    label: "Atomic note",
    icon: ObjectAtomicNoteIcon,
    tone: "amber",
  },
  { id: "media", label: "Media", icon: ObjectMediaIcon, tone: "cyan" },
  { id: "travel", label: "Travel", icon: ObjectTravelIcon, tone: "purple" },
  { id: "page", label: "Page", icon: ObjectPageIcon, tone: "blue" },
  { id: "tag", label: "Tag", icon: ObjectTagIcon, tone: "orange" },
  { id: "image", label: "Image", icon: ObjectImageIcon, tone: "red" },
  { id: "weblink", label: "Weblink", icon: ObjectWeblinkIcon, tone: "blue" },
  { id: "pdf", label: "PDF", icon: ObjectPdfIcon, tone: "red" },
  { id: "audio", label: "Audio", icon: ObjectAudioIcon, tone: "red" },
  { id: "file", label: "File", icon: ObjectFileIcon, tone: "red" },
  { id: "tweet", label: "Tweet", icon: ObjectTweetIcon, tone: "blue" },
  { id: "ai-chat", label: "AI chat", icon: ObjectAiChatIcon, tone: "purple" },
  { id: "table", label: "Table", icon: ObjectTableIcon, tone: "blue" },
  { id: "task", label: "Task", icon: ObjectTaskIcon, tone: "orange" },
  { id: "query", label: "Query", icon: ObjectQueryIcon, tone: "green" },
  { id: "archive", label: "Archive", icon: ObjectArchiveIcon, tone: "gray" },
];

const objectTypeDefinitionById = Object.fromEntries(
  objectTypeDefinitions.map((definition) => [definition.id, definition]),
) as Record<string, ObjectTypeDefinition>;

function ObjectIconBadge({
  icon: Icon,
  tone,
  className,
  iconClassName,
  variant = "default",
  ...props
}: ObjectIconBadgeProps) {
  return (
    <span
      data-slot="object-icon-badge"
      className={[
        "inline-flex shrink-0 items-center justify-center",
        variant === "sidebar"
          ? "min-h-[1.3em] min-w-[1.3em] rounded-[0.33em]"
          : variant === "menu"
            ? "rounded-[0.475em] border p-1 [border-width:0.5px]"
            : "size-6 rounded-[7px] border",
        objectIconToneBadgeClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <Icon
        className={
          iconClassName ??
          (variant === "sidebar"
            ? "size-[1em]"
            : variant === "menu"
              ? "size-3"
              : "size-4")
        }
      />
    </span>
  );
}

export {
  ObjectAiChatIcon,
  ObjectArchiveIcon,
  ObjectAreaIcon,
  ObjectAtomicNoteIcon,
  ObjectAudioIcon,
  ObjectBookIcon,
  ObjectCodeIcon,
  ObjectCollectionIcon,
  ObjectDefinitionIcon,
  ObjectFileIcon,
  ObjectIconBadge,
  type ObjectIconBadgeProps,
  type ObjectIconProps,
  type ObjectIconTone,
  ObjectIdeaIcon,
  ObjectImageIcon,
  ObjectKnowledgeIcon,
  ObjectMediaIcon,
  ObjectMeetingIcon,
  ObjectOrganizationIcon,
  ObjectPageIcon,
  ObjectPdfIcon,
  ObjectPersonIcon,
  ObjectPlaceIcon,
  ObjectProjectIcon,
  ObjectQueryIcon,
  ObjectQuoteIcon,
  ObjectTableIcon,
  ObjectTagIcon,
  ObjectTaskIcon,
  ObjectTravelIcon,
  ObjectTweetIcon,
  type ObjectTypeDefinition,
  ObjectWeblinkIcon,
  objectIconToneBadgeClass,
  objectIconToneTextClass,
  objectTypeDefinitionById,
  objectTypeDefinitions,
};
