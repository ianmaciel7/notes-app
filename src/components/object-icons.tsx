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
  amber: "text-[oklch(0.5708_0.1192_59.46)] dark:text-[oklch(0.9243_0.1151_95.76)]",
  blue: "text-[oklch(0.5035_0.1579_264.41)] dark:text-[oklch(0.8823_0.0571_254.14)]",
  cyan: "text-[oklch(0.4908_0.0793_218.94)] dark:text-[oklch(0.9167_0.0772_205.09)]",
  emerald: "text-[oklch(0.4933_0.0939_167.09)] dark:text-[oklch(0.9049_0.0895_164.20)]",
  fuchsia: "text-[oklch(0.5124_0.1866_323.57)] dark:text-[oklch(0.9030_0.0733_319.57)]",
  gray: "text-[oklch(0.3887_0.0052_301.05)] dark:text-[oklch(0.9163_0.0017_67.07)]",
  green: "text-[oklch(0.5327_0.1221_151.70)] dark:text-[oklch(0.9250_0.0805_156.05)]",
  lime: "text-[oklch(0.5189_0.1237_130.14)] dark:text-[oklch(0.9382_0.1216_124.35)]",
  neutral: "text-[oklch(0.2987_0.0072_285.88)] dark:text-[oklch(0.9163_0.0017_67.07)]",
  orange: "text-[oklch(0.5570_0.1387_43.21)] dark:text-[oklch(0.9015_0.0729_70.69)]",
  pink: "text-[oklch(0.5203_0.1617_358.32)] dark:text-[oklch(0.8994_0.0589_343.16)]",
  purple: "text-[oklch(0.5082_0.1955_304.61)] dark:text-[oklch(0.9024_0.0605_306.66)]",
  red: "text-[oklch(0.5060_0.1552_24.58)] dark:text-[oklch(0.8845_0.0592_18.27)]",
  rose: "text-[oklch(0.5096_0.1640_12.19)] dark:text-[oklch(0.8925_0.0559_9.93)]",
  sky: "text-[oklch(0.4914_0.0976_237.18)] dark:text-[oklch(0.9014_0.0556_230.95)]",
  teal: "text-[oklch(0.4954_0.0774_186.74)] dark:text-[oklch(0.9099_0.0927_180.48)]",
  violet: "text-[oklch(0.5047_0.2017_295.51)] dark:text-[oklch(0.8943_0.0550_293.25)]",
  yellow: "text-[oklch(0.5532_0.1050_76.42)] dark:text-[oklch(0.9451_0.1242_101.55)]",
};

const objectIconToneBadgeClass: Record<ObjectIconTone, string> = {
  amber:
    "border-[oklch(0.8790_0.1533_91.61)] bg-[oklch(0.9746_0.0399_94.73)] text-[oklch(0.5708_0.1192_59.46)] dark:border-[oklch(0.7463_0.1550_72.02)] dark:bg-[oklch(0.3740_0.0489_49.61)] dark:text-[oklch(0.9243_0.1151_95.76)]",
  blue: "border-[oklch(0.8091_0.0957_251.83)] bg-[oklch(0.9513_0.0235_256.13)] text-[oklch(0.5035_0.1579_264.41)] dark:border-[oklch(0.6129_0.1750_259.87)] dark:bg-[oklch(0.3498_0.0543_269.40)] dark:text-[oklch(0.8823_0.0571_254.14)]",
  cyan: "border-[oklch(0.8651_0.1154_207.11)] bg-[oklch(0.9704_0.0314_204.11)] text-[oklch(0.4908_0.0793_218.94)] dark:border-[oklch(0.6766_0.1167_214.15)] dark:bg-[oklch(0.3007_0.0267_224.29)] dark:text-[oklch(0.9167_0.0772_205.09)]",
  emerald:
    "border-[oklch(0.8452_0.1299_165.01)] bg-[oklch(0.9660_0.0361_163.39)] text-[oklch(0.4933_0.0939_167.09)] dark:border-[oklch(0.6669_0.1375_163.89)] dark:bg-[oklch(0.3029_0.0391_174.11)] dark:text-[oklch(0.9049_0.0895_164.20)]",
  fuchsia:
    "border-[oklch(0.8330_0.1322_321.41)] bg-[oklch(0.9650_0.0269_320.10)] text-[oklch(0.5124_0.1866_323.57)] dark:border-[oklch(0.6548_0.2419_322.21)] dark:bg-[oklch(0.3931_0.1141_324.82)] dark:text-[oklch(0.9030_0.0733_319.57)]",
  gray: "border-[oklch(0.8643_0.0017_67.13)] bg-[oklch(0.9856_0.0016_67.00)] text-[oklch(0.3887_0.0052_301.05)] dark:border-[oklch(0.4918_0.0038_16.70)] dark:bg-[oklch(0.2987_0.0072_285.88)] dark:text-[oklch(0.9163_0.0017_67.07)]",
  green:
    "border-[oklch(0.8712_0.1363_154.48)] bg-[oklch(0.9732_0.0311_157.36)] text-[oklch(0.5327_0.1221_151.70)] dark:border-[oklch(0.6981_0.1758_150.49)] dark:bg-[oklch(0.3406_0.0437_157.15)] dark:text-[oklch(0.9250_0.0805_156.05)]",
  lime: "border-[oklch(0.8972_0.1785_126.69)] bg-[oklch(0.9766_0.0483_121.18)] text-[oklch(0.5189_0.1237_130.14)] dark:border-[oklch(0.7313_0.1880_130.19)] dark:bg-[oklch(0.3653_0.0648_128.67)] dark:text-[oklch(0.9382_0.1216_124.35)]",
  neutral:
    "border-[oklch(0.8643_0.0017_67.13)] bg-[oklch(0.9676_0.0016_67.02)] text-[oklch(0.2987_0.0072_285.88)] dark:border-[oklch(0.4918_0.0038_16.70)] dark:bg-[oklch(0.2987_0.0072_285.88)] dark:text-[oklch(0.9163_0.0017_67.07)]",
  orange:
    "border-[oklch(0.8366_0.1165_66.28)] bg-[oklch(0.9668_0.0264_74.74)] text-[oklch(0.5570_0.1387_43.21)] dark:border-[oklch(0.6867_0.1727_49.09)] dark:bg-[oklch(0.3606_0.0502_39.71)] dark:text-[oklch(0.9015_0.0729_70.69)]",
  pink: "border-[oklch(0.8228_0.1095_345.98)] bg-[oklch(0.9613_0.0209_342.30)] text-[oklch(0.5203_0.1617_358.32)] dark:border-[oklch(0.6464_0.1975_353.62)] dark:bg-[oklch(0.4103_0.1020_357.14)] dark:text-[oklch(0.8994_0.0589_343.16)]",
  purple:
    "border-[oklch(0.8268_0.1083_306.36)] bg-[oklch(0.9630_0.0229_308.05)] text-[oklch(0.5082_0.1955_304.61)] dark:border-[oklch(0.6212_0.2186_304.36)] dark:bg-[oklch(0.3493_0.0724_308.39)] dark:text-[oklch(0.9024_0.0605_306.66)]",
  red: "border-[oklch(0.8077_0.1035_19.54)] bg-[oklch(0.9530_0.0218_17.35)] text-[oklch(0.5060_0.1552_24.58)] dark:border-[oklch(0.6272_0.1917_24.54)] dark:bg-[oklch(0.3586_0.0571_20.25)] dark:text-[oklch(0.8845_0.0592_18.27)]",
  rose: "border-[oklch(0.8097_0.1061_11.61)] bg-[oklch(0.9563_0.0218_13.86)] text-[oklch(0.5096_0.1640_12.19)] dark:border-[oklch(0.6345_0.2004_15.44)] dark:bg-[oklch(0.3588_0.0694_1.78)] dark:text-[oklch(0.8925_0.0559_9.93)]",
  sky: "border-[oklch(0.8276_0.1013_230.34)] bg-[oklch(0.9654_0.0192_235.84)] text-[oklch(0.4914_0.0976_237.18)] dark:border-[oklch(0.6587_0.1360_235.85)] dark:bg-[oklch(0.3160_0.0372_234.47)] dark:text-[oklch(0.9014_0.0556_230.95)]",
  teal: "border-[oklch(0.8549_0.1251_181.11)] bg-[oklch(0.9678_0.0321_182.40)] text-[oklch(0.4954_0.0774_186.74)] dark:border-[oklch(0.6738_0.1149_183.05)] dark:bg-[oklch(0.3652_0.0444_191.00)] dark:text-[oklch(0.9099_0.0927_180.48)]",
  violet:
    "border-[oklch(0.8112_0.1014_293.55)] bg-[oklch(0.9564_0.0229_293.96)] text-[oklch(0.5047_0.2017_295.51)] dark:border-[oklch(0.6027_0.2044_293.24)] dark:bg-[oklch(0.4196_0.1217_298.90)] dark:text-[oklch(0.8943_0.0550_293.25)]",
  yellow:
    "border-[oklch(0.9053_0.1656_98.12)] bg-[oklch(0.9810_0.0480_103.47)] text-[oklch(0.5532_0.1050_76.42)] dark:border-[oklch(0.7610_0.1520_87.61)] dark:bg-[oklch(0.4065_0.0606_68.35)] dark:text-[oklch(0.9451_0.1242_101.55)]",
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
          (variant === "sidebar" ? "size-[1em]" : variant === "menu" ? "size-3" : "size-4")
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
