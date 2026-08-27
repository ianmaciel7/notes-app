import type { ComponentPropsWithoutRef, ElementType } from "react";

import type {
  ObjectIconName as PersistedObjectIconName,
  ObjectIconTone,
} from "@/lib/workspace-object-types";

type ObjectIconProps = Omit<ComponentPropsWithoutRef<"svg">, "name">;
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
  cyan: "text-[oklch(0.4908_0.0793_218.94)]",
  emerald: "text-[oklch(0.4933_0.0939_167.09)]",
  gray: "text-[oklch(0.4289_0.0021_324.71)]",
  green: "text-[oklch(0.5327_0.1221_151.70)]",
  orange: "text-[oklch(0.5570_0.1387_43.21)]",
  purple: "text-[oklch(0.5082_0.1955_304.61)]",
  red: "text-[oklch(0.5060_0.1552_24.58)]",
  rose: "text-[oklch(0.5096_0.1640_12.19)]",
  sky: "text-[oklch(0.4914_0.0976_237.18)]",
};

const objectIconToneBadgeClass: Record<ObjectIconTone, string> = {
  amber:
    "border-[oklch(0.8790_0.1533_91.61)] bg-[oklch(0.9746_0.0399_94.73)] text-[oklch(0.5708_0.1192_59.46)]",
  blue: "border-[oklch(0.8091_0.0957_251.83)] bg-[oklch(0.9513_0.0235_256.13)] text-[oklch(0.5035_0.1579_264.41)]",
  cyan: "border-[oklch(0.8651_0.1154_207.11)] bg-[oklch(0.9704_0.0314_204.11)] text-[oklch(0.4908_0.0793_218.94)]",
  emerald:
    "border-[oklch(0.8452_0.1299_165.01)] bg-[oklch(0.9660_0.0361_163.39)] text-[oklch(0.4933_0.0939_167.09)]",
  gray: "border-[oklch(0.8643_0.0017_67.13)] bg-[oklch(0.9766_0.0016_67.01)] text-[oklch(0.4289_0.0021_324.71)]",
  green:
    "border-[oklch(0.8712_0.1363_154.48)] bg-[oklch(0.9732_0.0311_157.36)] text-[oklch(0.5327_0.1221_151.70)]",
  orange:
    "border-[oklch(0.8366_0.1165_66.28)] bg-[oklch(0.9668_0.0264_74.74)] text-[oklch(0.5570_0.1387_43.21)]",
  purple:
    "border-[oklch(0.8268_0.1083_306.36)] bg-[oklch(0.9630_0.0229_308.05)] text-[oklch(0.5082_0.1955_304.61)]",
  red: "border-[oklch(0.8077_0.1035_19.54)] bg-[oklch(0.9530_0.0218_17.35)] text-[oklch(0.5060_0.1552_24.58)]",
  rose: "border-[oklch(0.8097_0.1061_11.61)] bg-[oklch(0.9563_0.0218_13.86)] text-[oklch(0.5096_0.1640_12.19)]",
  sky: "border-[oklch(0.8276_0.1013_230.34)] bg-[oklch(0.9654_0.0192_235.84)] text-[oklch(0.4914_0.0976_237.18)]",
};

type ObjectIconName = PersistedObjectIconName | "code" | "knowledge";

const objectIconPath: Record<ObjectIconName, string> = {
  "ai-chat":
    "M216 80h-32V48a16 16 0 0 0-16-16H40a16 16 0 0 0-16 16v128a8 8 0 0 0 13 6.22L72 154v30a16 16 0 0 0 16 16h93.59L219 230.22a8 8 0 0 0 5 1.78a8 8 0 0 0 8-8V96a16 16 0 0 0-16-16M66.55 137.78L40 159.25V48h128v88H71.58a8 8 0 0 0-5.03 1.78M216 207.25l-26.55-21.47a8 8 0 0 0-5-1.78H88v-32h80a16 16 0 0 0 16-16V96h32Z",
  archive:
    "M216 48H40a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16v88a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-88a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16M40 64h176v32H40Zm160 136H56v-88h144Zm-48-56a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8",
  area: "M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m0 176H48V48h160z",
  "atomic-note":
    "M208 88H48a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-96a16 16 0 0 0-16-16m0 112H48v-96h160zM48 64a8 8 0 0 1 8-8h144a8 8 0 0 1 0 16H56a8 8 0 0 1-8-8m16-32a8 8 0 0 1 8-8h112a8 8 0 0 1 0 16H72a8 8 0 0 1-8-8",
  audio:
    "M56 96v64a8 8 0 0 1-16 0V96a8 8 0 0 1 16 0m32-72a8 8 0 0 0-8 8v192a8 8 0 0 0 16 0V32a8 8 0 0 0-8-8m40 32a8 8 0 0 0-8 8v128a8 8 0 0 0 16 0V64a8 8 0 0 0-8-8m40 32a8 8 0 0 0-8 8v64a8 8 0 0 0 16 0V96a8 8 0 0 0-8-8m40-16a8 8 0 0 0-8 8v96a8 8 0 0 0 16 0V80a8 8 0 0 0-8-8",
  book: "M232 48h-72a40 40 0 0 0-32 16a40 40 0 0 0-32-16H24a8 8 0 0 0-8 8v144a8 8 0 0 0 8 8h72a24 24 0 0 1 24 24a8 8 0 0 0 16 0a24 24 0 0 1 24-24h72a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8M96 192H32V64h64a24 24 0 0 1 24 24v112a39.8 39.8 0 0 0-24-8m128 0h-64a39.8 39.8 0 0 0-24 8V88a24 24 0 0 1 24-24h64Z",
  code: "M69.12 94.15 28.5 128l40.62 33.85a8 8 0 1 1-10.24 12.29l-48-40a8 8 0 0 1 0-12.29l48-40a8 8 0 0 1 10.24 12.3m176 27.7-48-40a8 8 0 1 0-10.24 12.3L227.5 128l-40.62 33.85a8 8 0 1 0 10.24 12.29l48-40a8 8 0 0 0 0-12.29M162.73 32.48a8 8 0 0 0-10.25 4.79l-64 176a8 8 0 0 0 15 5.46l64-176a8 8 0 0 0-4.75-10.25",
  definition:
    "M184 32H72a16 16 0 0 0-16 16v176a8 8 0 0 0 12.24 6.78L128 193.43l59.77 37.35A8 8 0 0 0 200 224V48a16 16 0 0 0-16-16m0 16v113.57l-51.77-32.35a8 8 0 0 0-8.48 0L72 161.56V48Zm-51.77 129.22a8 8 0 0 0-8.48 0L72 209.57v-29.14l56-35l56 35v29.14Z",
  file: "m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48z",
  idea: "M176 232a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8m40-128a87.55 87.55 0 0 1-33.64 69.21A16.24 16.24 0 0 0 176 186v6a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16v-6a16 16 0 0 0-6.23-12.66A87.59 87.59 0 0 1 40 104.49C39.74 56.83 78.26 17.14 125.88 16A88 88 0 0 1 216 104m-16 0a72 72 0 0 0-73.74-72c-39 .92-70.47 33.39-70.26 72.39a71.65 71.65 0 0 0 27.64 56.3A32 32 0 0 1 96 186v6h64v-6a32.15 32.15 0 0 1 12.47-25.35A71.65 71.65 0 0 0 200 104m-16.11-9.34a57.6 57.6 0 0 0-46.56-46.55a8 8 0 0 0-2.66 15.78c16.57 2.79 30.63 16.85 33.44 33.45A8 8 0 0 0 176 104a9 9 0 0 0 1.35-.11a8 8 0 0 0 6.54-9.23",
  image:
    "M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v102.75l-26.07-26.06a16 16 0 0 0-22.63 0l-20 20l-44-44a16 16 0 0 0-22.62 0L40 149.37V56ZM40 172l52-52l80 80H40Zm176 28h-21.37l-36-36l20-20L216 181.38zm-72-100a12 12 0 1 1 12 12a12 12 0 0 1-12-12",
  knowledge:
    "M184 80a56 56 0 0 0-112 0 56 56 0 0 0-32 50.65C40 173.91 85.6 216 128 216s88-42.09 88-85.35A56 56 0 0 0 184 80m-56 120c-33.57 0-72-35.16-72-69.35A40 40 0 0 1 96 91a8 8 0 0 0 8-8v-3a40 40 0 0 1 80 0v3a8 8 0 0 0 8 8 40 40 0 0 1 8 39.65C200 164.84 161.57 200 128 200m40-88a8 8 0 0 1-8 8h-24v24a8 8 0 0 1-16 0v-24H96a8 8 0 0 1 0-16h24V80a8 8 0 0 1 16 0v24h24a8 8 0 0 1 8 8",
  media:
    "M216 64h-68.69l34.35-34.34a8 8 0 1 0-11.32-11.32L128 60.69L85.66 18.34a8 8 0 0 0-11.32 11.32L108.69 64H40a16 16 0 0 0-16 16v120a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16M40 80h104v120H40Zm176 120h-56V80h56zm-16-84a12 12 0 1 1-12-12a12 12 0 0 1 12 12m0 48a12 12 0 1 1-12-12a12 12 0 0 1 12 12",
  meeting:
    "M244.8 150.4a8 8 0 0 1-11.2-1.6A51.6 51.6 0 0 0 192 128a8 8 0 0 1-7.37-4.89a8 8 0 0 1 0-6.22A8 8 0 0 1 192 112a24 24 0 1 0-23.24-30a8 8 0 1 1-15.5-4A40 40 0 1 1 219 117.51a67.94 67.94 0 0 1 27.43 21.68a8 8 0 0 1-1.63 11.21M190.92 212a8 8 0 1 1-13.84 8a57 57 0 0 0-98.16 0a8 8 0 1 1-13.84-8a72.06 72.06 0 0 1 33.74-29.92a48 48 0 1 1 58.36 0A72.06 72.06 0 0 1 190.92 212M128 176a32 32 0 1 0-32-32a32 32 0 0 0 32 32m-56-56a8 8 0 0 0-8-8a24 24 0 1 1 23.24-30a8 8 0 1 0 15.5-4A40 40 0 1 0 37 117.51a67.94 67.94 0 0 0-27.4 21.68a8 8 0 1 0 12.8 9.61A51.6 51.6 0 0 1 64 128a8 8 0 0 0 8-8",
  organization:
    "M240 208h-16V96a16 16 0 0 0-16-16h-64V32a16 16 0 0 0-24.88-13.32L39.12 72A16 16 0 0 0 32 85.34V208H16a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16M208 96v112h-64V96ZM48 85.34L128 32v176H48ZM112 112v16a8 8 0 0 1-16 0v-16a8 8 0 1 1 16 0m-32 0v16a8 8 0 0 1-16 0v-16a8 8 0 1 1 16 0m0 56v16a8 8 0 0 1-16 0v-16a8 8 0 0 1 16 0m32 0v16a8 8 0 0 1-16 0v-16a8 8 0 0 1 16 0",
  page: "m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48zm-32-80a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8",
  pdf: "M224 152a8 8 0 0 1-8 8h-24v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8M92 172a28 28 0 0 1-28 28h-8v8a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h16a28 28 0 0 1 28 28m-16 0a12 12 0 0 0-12-12h-8v24h8a12 12 0 0 0 12-12m88 8a36 36 0 0 1-36 36h-16a8 8 0 0 1-8-8v-56a8 8 0 0 1 8-8h16a36 36 0 0 1 36 36m-16 0a20 20 0 0 0-20-20h-8v40h8a20 20 0 0 0 20-20M40 112V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88v24a8 8 0 0 1-16 0V96h-48a8 8 0 0 1-8-8V40H56v72a8 8 0 0 1-16 0m120-32h28.69L160 51.31Z",
  person:
    "M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56",
  place:
    "M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.2 254.2 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.2 254.2 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118",
  project:
    "m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.34 44l-29.77 16.3l-80.35-44Zm0 88L47.66 76l33.9-18.56l80.34 44ZM40 90l80 43.78v85.79l-80-43.75Zm176 85.78l-80 43.79v-85.75l32-17.51V152a8 8 0 0 0 16 0v-44.45L216 90v85.77Z",
  query:
    "M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8m8 72h72a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16m88 48H40a8 8 0 0 0 0 16h88a8 8 0 0 0 0-16m109.66 13.66a8 8 0 0 1-11.32 0L206 177.36A40 40 0 1 1 217.36 166l20.3 20.3a8 8 0 0 1 0 11.36M184 168a24 24 0 1 0-24-24a24 24 0 0 0 24 24",
  quote:
    "M100 56H40a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h60v8a32 32 0 0 1-32 32a8 8 0 0 0 0 16a48.05 48.05 0 0 0 48-48V72a16 16 0 0 0-16-16m0 80H40V72h60Zm116-80h-60a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h60v8a32 32 0 0 1-32 32a8 8 0 0 0 0 16a48.05 48.05 0 0 0 48-48V72a16 16 0 0 0-16-16m0 80h-60V72h60Z",
  table:
    "M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8M40 112h40v32H40Zm56 0h120v32H96Zm120-48v32H40V64ZM40 160h40v32H40Zm176 32H96v-32h120z",
  tag: "M243.31 136L144 36.69A15.86 15.86 0 0 0 132.69 32H40a8 8 0 0 0-8 8v92.69A15.86 15.86 0 0 0 36.69 144L136 243.31a16 16 0 0 0 22.63 0l84.68-84.68a16 16 0 0 0 0-22.63m-96 96L48 132.69V48h84.69L232 147.31ZM96 84a12 12 0 1 1-12-12a12 12 0 0 1 12 12",
  task: "M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88",
  travel:
    "M104 88v96a8 8 0 0 1-16 0V88a8 8 0 0 1 16 0m24-8a8 8 0 0 0-8 8v96a8 8 0 0 0 16 0V88a8 8 0 0 0-8-8m32 0a8 8 0 0 0-8 8v96a8 8 0 0 0 16 0V88a8 8 0 0 0-8-8m48-16v144a16 16 0 0 1-16 16h-16v16a8 8 0 0 1-16 0v-16H96v16a8 8 0 0 1-16 0v-16H64a16 16 0 0 1-16-16V64a16 16 0 0 1 16-16h24V24a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v24h24a16 16 0 0 1 16 16M104 48h48V24a8 8 0 0 0-8-8h-32a8 8 0 0 0-8 8Zm88 160V64H64v144z",
  tweet:
    "M247.39 68.94A8 8 0 0 0 240 64h-30.43a48.66 48.66 0 0 0-41.47-24a46.9 46.9 0 0 0-33.75 13.7A47.9 47.9 0 0 0 120 88v6.09C79.74 83.47 46.81 50.72 46.46 50.37a8 8 0 0 0-13.65 4.92c-4.31 47.79 9.57 79.77 22 98.18a111 111 0 0 0 21.88 24.2c-15.23 17.53-39.21 26.74-39.47 26.84a8 8 0 0 0-3.85 11.93c.75 1.12 3.75 5.05 11.08 8.72C53.51 229.7 65.48 232 80 232c70.67 0 129.72-54.42 135.75-124.44l29.91-29.9a8 8 0 0 0 1.73-8.72m-45 29.41a8 8 0 0 0-2.32 5.14C196 166.58 143.28 216 80 216c-10.56 0-18-1.4-23.22-3.08c11.51-6.25 27.56-17 37.88-32.48A8 8 0 0 0 92 169.08c-.47-.27-43.91-26.34-44-96c16 13 45.25 33.17 78.67 38.79A8 8 0 0 0 136 104V88a32 32 0 0 1 9.6-22.92A30.94 30.94 0 0 1 167.9 56c12.66.16 24.49 7.88 29.44 19.21a8 8 0 0 0 7.33 4.79h16Z",
  weblink:
    "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m88 104a87.6 87.6 0 0 1-6.4 32.94l-44.7-27.49a15.9 15.9 0 0 0-6.24-2.23l-22.82-3.08a16.11 16.11 0 0 0-16 7.86h-8.72l-3.8-7.86a15.91 15.91 0 0 0-11-8.67l-8-1.73L96.14 104h16.71a16.06 16.06 0 0 0 7.73-2l12.25-6.76a16.6 16.6 0 0 0 3-2.14l26.91-24.34A15.93 15.93 0 0 0 166 49.1l-.36-.65A88.11 88.11 0 0 1 216 128m-72.69-86.66L152 56.9l-26.91 24.34L112.85 88H96.14a16 16 0 0 0-13.88 8l-8.73 15.23l-10.15-27.04l10.94-25.87a87.87 87.87 0 0 1 69-17ZM40 128a87.5 87.5 0 0 1 8.54-37.8l11.34 30.27a16 16 0 0 0 11.62 10l21.43 4.61l3.81 7.92a16.09 16.09 0 0 0 14.4 9h1.48l-7.23 16.23a16 16 0 0 0 2.86 17.37l.14.14l19.61 20.2l-1.94 10A88.11 88.11 0 0 1 40 128m102.58 86.78l1.13-5.81a16.09 16.09 0 0 0-4-13.9a2 2 0 0 1-.14-.14L120 174.74L133.7 144l22.82 3.08l45.72 28.12a88.18 88.18 0 0 1-59.66 39.58",
};

function createObjectIcon(name: ObjectIconName) {
  function ObjectIcon({ className, ...props }: ObjectIconProps) {
    return (
      <svg
        data-slot="object-icon"
        data-icon-name={name}
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        className={className}
        {...props}
      >
        <path d={objectIconPath[name]} />
      </svg>
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
  ObjectWeblinkIcon,
  objectIconToneBadgeClass,
  objectIconToneTextClass,
  objectTypeDefinitionById,
  objectTypeDefinitions,
  type ObjectIconBadgeProps,
  type ObjectIconProps,
  type ObjectIconTone,
  type ObjectTypeDefinition,
};
