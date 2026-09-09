import type { ComponentPropsWithoutRef, ElementType, SVGProps } from "react";

import type {
  ObjectIconTone,
  ObjectIconName as PersistedObjectIconName,
} from "@/lib/space-object-types";

type ObjectIconProps = SVGProps<SVGSVGElement>;
export type ObjectTypeIcon = ElementType<ObjectIconProps>;
type ObjectTypeDefinition = {
  id: string;
  label: string;
  icon: ObjectTypeIcon;
  tone: ObjectIconTone;
};

type ObjectIconBadgeProps = ComponentPropsWithoutRef<"span"> & {
  icon: ObjectTypeIcon;
  tone: ObjectIconTone;
  iconClassName?: string;
  variant?: "default" | "menu" | "sidebar";
};

type ObjectTypeIconAppearanceInput = {
  id?: string;
  iconName?: PersistedObjectIconName;
  tone: ObjectIconTone;
  icon?: ObjectTypeIcon;
};

type ObjectTypeIconAppearance = {
  icon: ObjectTypeIcon;
  iconName: PersistedObjectIconName;
  tone: ObjectIconTone;
};

const objectIconToneTextClass: Record<ObjectIconTone, string> = {
  amber: "text-[var(--type-label-text-amber)]",
  blue: "text-[var(--type-label-text-blue)]",
  cyan: "text-[var(--type-label-text-cyan)]",
  emerald: "text-[var(--type-label-text-emerald)]",
  fuchsia: "text-[var(--type-label-text-fuchsia)]",
  gray: "text-[var(--type-label-text-gray)]",
  green: "text-[var(--type-label-text-green)]",
  indigo: "text-[var(--type-label-text-indigo)]",
  lime: "text-[var(--type-label-text-lime)]",
  neutral: "text-[var(--type-label-text-neutral)]",
  orange: "text-[var(--type-label-text-orange)]",
  pink: "text-[var(--type-label-text-pink)]",
  purple: "text-[var(--type-label-text-purple)]",
  red: "text-[var(--type-label-text-red)]",
  rose: "text-[var(--type-label-text-rose)]",
  sky: "text-[var(--type-label-text-sky)]",
  teal: "text-[var(--type-label-text-teal)]",
  violet: "text-[var(--type-label-text-violet)]",
  yellow: "text-[var(--type-label-text-yellow)]",
};

const objectIconToneBadgeClass: Record<ObjectIconTone, string> = {
  amber:
    "border-[var(--type-label-border-amber)] bg-[var(--type-label-bg-amber)] text-[var(--type-label-text-amber)]",
  blue: "border-[var(--type-label-border-blue)] bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  cyan: "border-[var(--type-label-border-cyan)] bg-[var(--type-label-bg-cyan)] text-[var(--type-label-text-cyan)]",
  emerald:
    "border-[var(--type-label-border-emerald)] bg-[var(--type-label-bg-emerald)] text-[var(--type-label-text-emerald)]",
  fuchsia:
    "border-[var(--type-label-border-fuchsia)] bg-[var(--type-label-bg-fuchsia)] text-[var(--type-label-text-fuchsia)]",
  gray: "border-[var(--type-label-border-gray)] bg-[var(--type-label-bg-gray)] text-[var(--type-label-text-gray)]",
  green:
    "border-[var(--type-label-border-green)] bg-[var(--type-label-bg-green)] text-[var(--type-label-text-green)]",
  indigo:
    "border-[var(--type-label-border-indigo)] bg-[var(--type-label-bg-indigo)] text-[var(--type-label-text-indigo)]",
  lime: "border-[var(--type-label-border-lime)] bg-[var(--type-label-bg-lime)] text-[var(--type-label-text-lime)]",
  neutral:
    "border-[var(--type-label-border-neutral)] bg-[var(--type-label-bg-neutral)] text-[var(--type-label-text-neutral)]",
  orange:
    "border-[var(--type-label-border-orange)] bg-[var(--type-label-bg-orange)] text-[var(--type-label-text-orange)]",
  pink: "border-[var(--type-label-border-pink)] bg-[var(--type-label-bg-pink)] text-[var(--type-label-text-pink)]",
  purple:
    "border-[var(--type-label-border-purple)] bg-[var(--type-label-bg-purple)] text-[var(--type-label-text-purple)]",
  red: "border-[var(--type-label-border-red)] bg-[var(--type-label-bg-red)] text-[var(--type-label-text-red)]",
  rose: "border-[var(--type-label-border-rose)] bg-[var(--type-label-bg-rose)] text-[var(--type-label-text-rose)]",
  sky: "border-[var(--type-label-border-sky)] bg-[var(--type-label-bg-sky)] text-[var(--type-label-text-sky)]",
  teal: "border-[var(--type-label-border-teal)] bg-[var(--type-label-bg-teal)] text-[var(--type-label-text-teal)]",
  violet:
    "border-[var(--type-label-border-violet)] bg-[var(--type-label-bg-violet)] text-[var(--type-label-text-violet)]",
  yellow:
    "border-[var(--type-label-border-yellow)] bg-[var(--type-label-bg-yellow)] text-[var(--type-label-text-yellow)]",
};

const capacitiesObjectTypeToneById: Record<string, ObjectIconTone> = {
  "ai-chat": "purple",
  "atomic-note": "amber",
  area: "indigo",
  audio: "red",
  book: "purple",
  definition: "violet",
  file: "red",
  flashcard: "fuchsia",
  idea: "yellow",
  image: "red",
  media: "teal",
  meeting: "red",
  organization: "red",
  page: "blue",
  pdf: "red",
  person: "orange",
  place: "emerald",
  project: "green",
  query: "green",
  quote: "rose",
  study_goal: "lime",
  table: "blue",
  tag: "orange",
  task: "orange",
  travel: "violet",
  tweet: "blue",
  weblink: "blue",
};

const canonicalObjectTypeAppearanceById: Record<
  string,
  { iconName: PersistedObjectIconName; tone: ObjectIconTone }
> = {
  atomic_note: { iconName: "atomic-note", tone: "amber" },
  study_goal: { iconName: "study-goal", tone: "lime" },
};

function getCapacitiesObjectTypeTone(
  id: string | undefined,
  fallback: ObjectIconTone,
): ObjectIconTone {
  return id ? (capacitiesObjectTypeToneById[id] ?? fallback) : fallback;
}

type ObjectIconName = PersistedObjectIconName | "code" | "knowledge";

const customObjectIconPaths: Record<ObjectIconName, string[]> = {
  "ai-chat": [
    "M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z",
  ],
  archive: [
    "M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z",
  ],
  area: [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z",
  ],
  "atomic-note": [
    "M208,88H48a16,16,0,0,0-16,16v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104A16,16,0,0,0,208,88Zm0,112H48V104H208v96ZM48,64a8,8,0,0,1,8-8H200a8,8,0,0,1,0,16H56A8,8,0,0,1,48,64ZM64,32a8,8,0,0,1,8-8H184a8,8,0,0,1,0,16H72A8,8,0,0,1,64,32Z",
  ],
  audio: [
    "M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z",
  ],
  book: [
    "M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z",
  ],
  code: [
    "M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z",
  ],
  definition: [
    "M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z",
  ],
  file: [
    "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z",
  ],
  flashcard: [
    "M76,36H200a20,20,0,0,1,20,20V160a20,20,0,0,1-20,20H184V164H200a4,4,0,0,0,4-4V56a4,4,0,0,0-4-4H76a4,4,0,0,0-4,4V72H56V56A20,20,0,0,1,76,36Z",
    "M48,76H172a20,20,0,0,1,20,20V200a20,20,0,0,1-20,20H48a20,20,0,0,1-20-20V96A20,20,0,0,1,48,76Zm0,16a4,4,0,0,0-4,4V200a4,4,0,0,0,4,4H172a4,4,0,0,0,4-4V96a4,4,0,0,0-4-4H48Zm24,40a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H80A8,8,0,0,1,72,132Zm0,36a8,8,0,0,1,8-8h56a8,8,0,0,1,0,16H80A8,8,0,0,1,72,168Z",
  ],
  idea: [
    "M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z",
  ],
  image: [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z",
  ],
  knowledge: [
    "M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39a56,56,0,0,0,0,101.2V176a48,48,0,0,0,88,26.49A48,48,0,0,0,216,176v-1.41A56.09,56.09,0,0,0,248,124ZM88,208a32,32,0,0,1-31.81-28.56A55.87,55.87,0,0,0,64,180h8a8,8,0,0,0,0-16H64A40,40,0,0,1,50.67,86.27,8,8,0,0,0,56,78.73V72a32,32,0,0,1,64,0v68.26A47.8,47.8,0,0,0,88,128a8,8,0,0,0,0,16,32,32,0,0,1,0,64Zm104-44h-8a8,8,0,0,0,0,16h8a55.87,55.87,0,0,0,7.81-.56A32,32,0,1,1,168,144a8,8,0,0,0,0-16,47.8,47.8,0,0,0-32,12.26V72a32,32,0,0,1,64,0v6.73a8,8,0,0,0,5.33,7.54A40,40,0,0,1,192,164Zm16-52a8,8,0,0,1-8,8h-4a36,36,0,0,1-36-36V80a8,8,0,0,1,16,0v4a20,20,0,0,0,20,20h4A8,8,0,0,1,208,112ZM60,120H56a8,8,0,0,1,0-16h4A20,20,0,0,0,80,84V80a8,8,0,0,1,16,0v4A36,36,0,0,1,60,120Z",
  ],
  media: [
    "M216,64H147.31l34.35-34.34a8,8,0,1,0-11.32-11.32L128,60.69,85.66,18.34A8,8,0,0,0,74.34,29.66L108.69,64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64M40,80H144V200H40Zm176,120H160V80h56Zm-16-84a12,12,0,1,1-12-12a12,12,0,0,1,12,12m0,48a12,12,0,1,1-12-12a12,12,0,0,1,12,12",
  ],
  meeting: [
    "M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z",
  ],
  organization: [
    "M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z",
  ],
  page: [
    "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z",
  ],
  pdf: [
    "M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z",
  ],
  person: [
    "M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z",
  ],
  place: [
    "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z",
  ],
  project: [
    "M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z",
  ],
  query: [
    "M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,72h72a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm88,48H40a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16Zm109.66,13.66a8,8,0,0,1-11.32,0L206,177.36A40,40,0,1,1,217.36,166l20.3,20.3A8,8,0,0,1,237.66,197.66ZM184,168a24,24,0,1,0-24-24A24,24,0,0,0,184,168Z",
  ],
  quote: [
    "M100,56H40A16,16,0,0,0,24,72v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,100,56Zm0,80H40V72h60ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,216,56Zm0,80H156V72h60Z",
  ],
  "study-goal": [
    "M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z",
  ],
  table: [
    "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z",
  ],
  tag: [
    "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z",
  ],
  task: [
    "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
  ],
  travel: [
    "M104,88v96a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm24-8a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,128,80Zm32,0a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,160,80Zm48-16V208a16,16,0,0,1-16,16H176v16a8,8,0,0,1-16,0V224H96v16a8,8,0,0,1-16,0V224H64a16,16,0,0,1-16-16V64A16,16,0,0,1,64,48H88V24A24,24,0,0,1,112,0h32a24,24,0,0,1,24,24V48h24A16,16,0,0,1,208,64ZM104,48h48V24a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8Zm88,160V64H64V208H192Z",
  ],
  tweet: [
    "M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z",
  ],
  weblink: [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z",
  ],
};

function createObjectIcon(name: ObjectIconName) {
  function ObjectIcon({ className, ...props }: ObjectIconProps) {
    return (
      <span
        className="relative inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none"
        style={{ verticalAlign: "-0.125em" }}
      >
        <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
          <svg
            viewBox="0 0 256 256"
            fill="currentColor"
            data-slot="object-icon"
            data-icon-name={name}
            data-local-object-icon={name}
            aria-hidden="true"
            focusable="false"
            className={className}
            {...props}
          >
            {customObjectIconPaths[name].map((path) => (
              <path clipRule="evenodd" d={path} fillRule="evenodd" key={path} />
            ))}
          </svg>
        </span>
      </span>
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
const ObjectFlashcardIcon = createObjectIcon("flashcard");
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
const ObjectStudyGoalIcon = createObjectIcon("study-goal");
const ObjectArchiveIcon = createObjectIcon("archive");
const ObjectCodeIcon = createObjectIcon("code");
const ObjectKnowledgeIcon = createObjectIcon("knowledge");
const ObjectCollectionIcon = ObjectAtomicNoteIcon;

const objectTypeDefinitions: ObjectTypeDefinition[] = [
  { id: "book", label: "Book", icon: ObjectBookIcon, tone: "purple" },
  { id: "person", label: "Person", icon: ObjectPersonIcon, tone: "orange" },
  { id: "area", label: "Area", icon: ObjectAreaIcon, tone: "indigo" },
  { id: "meeting", label: "Meeting", icon: ObjectMeetingIcon, tone: "red" },
  { id: "quote", label: "Quote", icon: ObjectQuoteIcon, tone: "rose" },
  {
    id: "definition",
    label: "Definition",
    icon: ObjectDefinitionIcon,
    tone: "violet",
  },
  { id: "flashcard", label: "Flashcard", icon: ObjectFlashcardIcon, tone: "fuchsia" },
  { id: "idea", label: "Idea", icon: ObjectIdeaIcon, tone: "yellow" },
  { id: "place", label: "Place", icon: ObjectPlaceIcon, tone: "emerald" },
  { id: "project", label: "Project", icon: ObjectProjectIcon, tone: "green" },
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
  { id: "media", label: "Media", icon: ObjectMediaIcon, tone: "teal" },
  { id: "travel", label: "Travel", icon: ObjectTravelIcon, tone: "violet" },
  { id: "page", label: "Page", icon: ObjectPageIcon, tone: "blue" },
  { id: "tag", label: "Tag", icon: ObjectTagIcon, tone: "orange" },
  { id: "image", label: "Image", icon: ObjectImageIcon, tone: "red" },
  { id: "weblink", label: "Weblink", icon: ObjectWeblinkIcon, tone: "blue" },
  { id: "pdf", label: "PDF", icon: ObjectPdfIcon, tone: "red" },
  { id: "audio", label: "Audio", icon: ObjectAudioIcon, tone: "red" },
  { id: "file", label: "File", icon: ObjectFileIcon, tone: "red" },
  { id: "tweet", label: "Tweet", icon: ObjectTweetIcon, tone: "blue" },
  { id: "ai-chat", label: "AI chat", icon: ObjectAiChatIcon, tone: "purple" },
  { id: "study-goal", label: "Study goal", icon: ObjectStudyGoalIcon, tone: "lime" },
  { id: "table", label: "Table", icon: ObjectTableIcon, tone: "blue" },
  { id: "task", label: "Task", icon: ObjectTaskIcon, tone: "orange" },
  { id: "query", label: "Query", icon: ObjectQueryIcon, tone: "green" },
  { id: "archive", label: "Archive", icon: ObjectArchiveIcon, tone: "gray" },
];

const objectTypeDefinitionById = Object.fromEntries(
  objectTypeDefinitions.map((definition) => [definition.id, definition]),
) as Record<string, ObjectTypeDefinition>;

function getObjectTypeIconAppearance({
  id,
  icon,
  iconName,
  tone,
}: ObjectTypeIconAppearanceInput): ObjectTypeIconAppearance {
  const canonical = id ? canonicalObjectTypeAppearanceById[id] : undefined;
  const resolvedIconName = canonical?.iconName ?? iconName;
  const definition = resolvedIconName ? objectTypeDefinitionById[resolvedIconName] : undefined;

  return {
    icon: definition?.icon ?? icon ?? ObjectAreaIcon,
    iconName: (definition?.id ?? resolvedIconName ?? "area") as PersistedObjectIconName,
    tone: canonical?.tone ?? getCapacitiesObjectTypeTone(id, tone),
  };
}

type ObjectTypeIconBadgeProps = Omit<ObjectIconBadgeProps, "icon" | "tone"> &
  ObjectTypeIconAppearanceInput;

function ObjectTypeIconBadge({ id, icon, iconName, tone, ...props }: ObjectTypeIconBadgeProps) {
  const appearance = getObjectTypeIconAppearance({ id, icon, iconName, tone });
  return <ObjectIconBadge icon={appearance.icon} tone={appearance.tone} {...props} />;
}

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
            ? "h-[22px] w-[22px] rounded-[0.475em] border p-1 [border-width:0.5px]"
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
          (variant === "sidebar" ? "size-[1em]" : variant === "menu" ? "size-3.5" : "size-4")
        }
      />
    </span>
  );
}

export {
  getCapacitiesObjectTypeTone,
  getObjectTypeIconAppearance,
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
  ObjectStudyGoalIcon,
  ObjectTableIcon,
  ObjectTagIcon,
  ObjectTaskIcon,
  ObjectTravelIcon,
  ObjectTweetIcon,
  type ObjectTypeDefinition,
  type ObjectTypeIconAppearance,
  ObjectTypeIconBadge,
  ObjectWeblinkIcon,
  objectIconToneBadgeClass,
  objectIconToneTextClass,
  objectTypeDefinitionById,
  objectTypeDefinitions,
};
