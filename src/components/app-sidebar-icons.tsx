import type * as React from "react";

import { cn } from "@/lib/utils";

type AppSidebarIconName =
  | "alert"
  | "archive"
  | "arrow-down"
  | "arrow-up"
  | "audio"
  | "book"
  | "calendar"
  | "check"
  | "chevron-right"
  | "chevrons-up-down"
  | "code"
  | "corner-down-left"
  | "copy"
  | "explore"
  | "file"
  | "grip-vertical"
  | "image"
  | "idea"
  | "knowledge"
  | "objects"
  | "page"
  | "pdf"
  | "pin-off"
  | "plus"
  | "project"
  | "search"
  | "sun"
  | "table"
  | "task"
  | "tweet"
  | "weblink"
  | "x"
  | "pin"
  | "flask"
  | "atomic-note"
  | "quote"
  | "dots";

type AppSidebarIconProps = React.ComponentProps<"svg"> & {
  name: AppSidebarIconName;
};

type IconPath = {
  d: string;
  opacity?: number;
};

const iconPaths: Record<Exclude<AppSidebarIconName, "flask">, readonly IconPath[]> = {
  alert: [
    {
      d: "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m-8-80V80a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0m20 36a12 12 0 1 1-12-12 12 12 0 0 1 12 12",
    },
  ],
  archive: [
    {
      d: "M216 48H40a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16v88a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-88a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16M40 64h176v32H40Zm160 136H56v-88h144Zm-48-56a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8",
    },
  ],
  "arrow-down": [
    {
      d: "m213.66 133.66-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L120 188.69V48a8 8 0 0 1 16 0v140.69l66.34-66.35a8 8 0 0 1 11.32 11.32",
    },
  ],
  "arrow-up": [
    {
      d: "m213.66 133.66a8 8 0 0 1-11.32 0L136 67.31V208a8 8 0 0 1-16 0V67.31l-66.34 66.35a8 8 0 0 1-11.32-11.32l80-80a8 8 0 0 1 11.32 0l80 80a8 8 0 0 1 0 11.32",
    },
  ],
  audio: [
    {
      d: "M80 88v80a8 8 0 0 1-16 0V88a8 8 0 0 1 16 0m48-48a8 8 0 0 0-8 8v160a8 8 0 0 0 16 0V48a8 8 0 0 0-8-8m64 48a8 8 0 0 0-8 8v64a8 8 0 0 0 16 0V96a8 8 0 0 0-8-8m-128 24H40a8 8 0 0 0 0 16h24Zm152 0h-24v16h24a8 8 0 0 0 0-16",
    },
  ],
  book: [
    {
      d: "M208 24H72a32 32 0 0 0-32 32v160a8 8 0 0 0 8 8h144a8 8 0 0 0 0-16H56a16 16 0 0 1 16-16h136a8 8 0 0 0 8-8V32a8 8 0 0 0-8-8m-8 152H72a31.8 31.8 0 0 0-16 4.29V56a16 16 0 0 1 16-16h128Zm-104-96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16h-64a8 8 0 0 1-8-8",
    },
  ],
  plus: [
    {
      d: "M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12",
    },
  ],
  search: [
    {
      d: "M232.49 215.51 185 168a92.12 92.12 0 1 0-17 17l47.53 47.54a12 12 0 0 0 17-17ZM44 112a68 68 0 1 1 68 68 68.07 68.07 0 0 1-68-68",
    },
  ],
  explore: [
    {
      d: "m199 125.31-49.88-18.39L130.69 57a19.92 19.92 0 0 0-37.38 0l-18.39 49.92L25 125.31a19.92 19.92 0 0 0 0 37.38l49.88 18.39L93.31 231a19.92 19.92 0 0 0 37.38 0l18.39-49.88L199 162.69a19.92 19.92 0 0 0 0-37.38m-63.38 35.16a12 12 0 0 0-7.11 7.11L112 212.28l-16.47-44.7a12 12 0 0 0-7.11-7.11L43.72 144l44.7-16.47a12 12 0 0 0 7.11-7.11L112 75.72l16.47 44.7a12 12 0 0 0 7.11 7.11l44.7 16.47ZM140 40a12 12 0 0 1 12-12h12V16a12 12 0 0 1 24 0v12h12a12 12 0 0 1 0 24h-12v12a12 12 0 0 1-24 0V52h-12a12 12 0 0 1-12-12m112 48a12 12 0 0 1-12 12h-4v4a12 12 0 0 1-24 0v-4h-4a12 12 0 0 1 0-24h4v-4a12 12 0 0 1 24 0v4h4a12 12 0 0 1 12 12",
    },
  ],
  calendar: [
    {
      d: "M208 28h-20v-4a12 12 0 0 0-24 0v4H92v-4a12 12 0 0 0-24 0v4H48a20 20 0 0 0-20 20v160a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20V48a20 20 0 0 0-20-20M68 52a12 12 0 0 0 24 0h72a12 12 0 0 0 24 0h16v24H52V52ZM52 204V100h152v104Zm60-80v56a12 12 0 0 1-24 0v-36.68a12 12 0 0 1-9.37-22l16-8A12 12 0 0 1 112 124m61.49 33.88L163.9 168h4.1a12 12 0 0 1 0 24h-32a12 12 0 0 1-8.71-20.25L155.45 142a4 4 0 0 0 .55-2a4 4 0 0 0-7.47-2a12 12 0 0 1-20.78-12A28 28 0 0 1 180 140a27.77 27.77 0 0 1-5.64 16.86 11 11 0 0 1-.87 1.02",
    },
  ],
  check: [
    {
      d: "m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32",
    },
  ],
  "chevron-right": [
    {
      d: "m181.66 133.66-80 80a8 8 0 0 1-11.32-11.32L164.69 128 90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32",
    },
  ],
  "chevrons-up-down": [
    {
      d: "M181.66 170.34a8 8 0 0 1 0 11.32l-48 48a8 8 0 0 1-11.32 0l-48-48a8 8 0 0 1 11.32-11.32L128 212.69l42.34-42.35a8 8 0 0 1 11.32 0m-96-84.68L128 43.31l42.34 42.35a8 8 0 0 0 11.32-11.32l-48-48a8 8 0 0 0-11.32 0l-48 48a8 8 0 0 0 11.32 11.32",
    },
  ],
  code: [
    {
      d: "M69.12 94.15 28.5 128l40.62 33.85a8 8 0 1 1-10.24 12.29l-48-40a8 8 0 0 1 0-12.29l48-40a8 8 0 0 1 10.24 12.3m176 27.7-48-40a8 8 0 1 0-10.24 12.3L227.5 128l-40.62 33.85a8 8 0 1 0 10.24 12.29l48-40a8 8 0 0 0 0-12.29M162.73 32.48a8 8 0 0 0-10.25 4.79l-64 176a8 8 0 0 0 15 5.46l64-176a8 8 0 0 0-4.75-10.25",
    },
  ],
  "corner-down-left": [
    {
      d: "M208 32a8 8 0 0 0-8 8v72a40 40 0 0 1-40 40H67.31l42.35-42.34a8 8 0 0 0-11.32-11.32l-56 56a8 8 0 0 0 0 11.32l56 56a8 8 0 0 0 11.32-11.32L67.31 168H160a56.06 56.06 0 0 0 56-56V40a8 8 0 0 0-8-8",
    },
  ],
  copy: [
    {
      d: "M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z",
    },
  ],
  pin: [
    {
      d: "m238.15 78.54l-60.69-60.68a20 20 0 0 0-28.3 0L97.2 70c-12.43-3.33-36.68-5.72-61.74 14.5a20 20 0 0 0-1.6 29.73l45.46 45.47l-39.8 39.8a12 12 0 0 0 17 17l39.8-39.81l45.47 45.46a20 20 0 0 0 14.12 5.85c.46 0 .93 0 1.4-.05a20 20 0 0 0 14.56-7.95c4.69-6.23 11-16.13 14.44-28s3.45-22.88.16-33.4l51.7-51.87a20 20 0 0 0-.02-28.19m-74.26 68.79a12 12 0 0 0-2.23 13.84c3.43 6.86 6.9 21-6.28 40.65L54.08 100.53c21.09-14.59 39.53-6.64 41-6a11.67 11.67 0 0 0 13.81-2.29l54.43-54.61l55 55Z",
    },
  ],
  objects: [
    {
      d: "M216 36H40a20 20 0 0 0-20 20v144a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20m-4 24v32H44V60ZM44 116h48v80H44Zm72 80v-80h96v80Z",
    },
  ],
  "pin-off": [
    {
      d: "M213.66 202.34a8 8 0 0 1-11.32 11.32l-160-160a8 8 0 0 1 11.32-11.32l22.08 22.08L105.37 34a16 16 0 0 1 22.63 0l94 94a16 16 0 0 1 0 22.63l-31.9 31.9ZM48.49 207.51 96 160l-55.51-55.51a8 8 0 0 1 11.31-11.31l112 112a8 8 0 0 1-11.31 11.31L96 160l-47.51 47.51a8 8 0 0 1-11.31-11.31",
    },
  ],
  file: [
    {
      d: "m213.66 82.34-56-56A8 8 0 0 0 152 24H64a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31 180.69 72H160ZM192 216H64V40h80v40a8 8 0 0 0 8 8h40Z",
    },
  ],
  "grip-vertical": [
    {
      d: "M96 60a12 12 0 1 1-12-12 12 12 0 0 1 12 12m76 12a12 12 0 1 0-12-12 12 12 0 0 0 12 12m-88 44a12 12 0 1 0 12 12 12 12 0 0 0-12-12m88 0a12 12 0 1 0 12 12 12 12 0 0 0-12-12m-88 68a12 12 0 1 0 12 12 12 12 0 0 0-12-12m88 0a12 12 0 1 0 12 12 12 12 0 0 0-12-12",
    },
  ],
  image: [
    {
      d: "M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v112.69l-34.34-34.35a8 8 0 0 0-11.32 0L140 164.69l-58.34-58.35a8 8 0 0 0-11.32 0L40 136.69V56Zm-76 68a20 20 0 1 1 20-20 20 20 0 0 1-20 20",
    },
  ],
  idea: [
    {
      d: "M176 232a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8m40-128a87.55 87.55 0 0 1-33.64 69.21A16.24 16.24 0 0 0 176 186v6a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16v-6a16 16 0 0 0-6.23-12.66A87.6 87.6 0 0 1 40 104.49C39.74 56.83 78.26 17.14 125.88 16A88 88 0 0 1 216 104m-16 0a72 72 0 0 0-73.74-72C87.34 32.92 55.79 65.33 56 104.4a71.65 71.65 0 0 0 27.64 56.3A32 32 0 0 1 96 186v6h64v-6a32.15 32.15 0 0 1 12.47-25.35A71.65 71.65 0 0 0 200 104",
    },
  ],
  knowledge: [
    {
      d: "M184 80a56 56 0 0 0-112 0 56 56 0 0 0-32 50.65C40 173.91 85.6 216 128 216s88-42.09 88-85.35A56 56 0 0 0 184 80m-56 120c-33.57 0-72-35.16-72-69.35A40 40 0 0 1 96 91a8 8 0 0 0 8-8v-3a40 40 0 0 1 80 0v3a8 8 0 0 0 8 8 40 40 0 0 1 8 39.65C200 164.84 161.57 200 128 200m40-88a8 8 0 0 1-8 8h-24v24a8 8 0 0 1-16 0v-24H96a8 8 0 0 1 0-16h24V80a8 8 0 0 1 16 0v24h24a8 8 0 0 1 8 8",
    },
  ],
  pdf: [
    {
      d: "M64 24h88a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88v128a16 16 0 0 1-16 16H64a16 16 0 0 1-16-16V40a16 16 0 0 1 16-16m88 16v48h48Zm-56 120a24 24 0 0 0 0-48H80a8 8 0 0 0-8 8v64a8 8 0 0 0 16 0v-24Zm-8-16v-16h8a8 8 0 0 1 0 16Zm64-32h-16a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h16a40 40 0 0 0 0-80m0 64h-8v-48h8a24 24 0 0 1 0 48",
    },
  ],
  project: [
    {
      d: "M216 56h-44.69l-18.35-18.34A8 8 0 0 0 147.31 36H88.69a8 8 0 0 0-5.65 1.66L64.69 56H40a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V72a16 16 0 0 0-16-16m0 144H40V72h28a8 8 0 0 0 5.66-2.34L92 51.31h52l18.34 18.35A8 8 0 0 0 168 72h48ZM88 96h80a8 8 0 0 1 0 16H88a8 8 0 0 1 0-16",
    },
  ],
  sun: [
    {
      d: "M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0m72 88a64 64 0 1 1-64-64 64.07 64.07 0 0 1 64 64m-16 0a48 48 0 1 0-48 48 48.05 48.05 0 0 0 48-48M58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32M192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72m5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM40 120H16a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16m88 88a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8m112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16",
    },
  ],
  table: [
    {
      d: "M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M40 56h176v40H40Zm0 56h56v88H40Zm72 88v-88h104v88Z",
    },
  ],
  task: [
    {
      d: "M229.66 77.66 101.66 205.66a8 8 0 0 1-11.32 0l-64-64a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32",
    },
  ],
  tweet: [
    {
      d: "M214.75 72.75c.15 2.06.15 4.12.15 6.18 0 63.14-48.06 135.9-135.9 135.9A135 135 0 0 1 6 193.5a99.4 99.4 0 0 0 11.53.59 95.7 95.7 0 0 0 59.33-20.44 47.87 47.87 0 0 1-44.68-33.19 60.3 60.3 0 0 0 9 .74 50.7 50.7 0 0 0 12.58-1.62 47.79 47.79 0 0 1-38.35-46.87v-.59a48.1 48.1 0 0 0 21.62 6.03A47.85 47.85 0 0 1 22.24 34.3a135.76 135.76 0 0 0 98.45 49.94 53.9 53.9 0 0 1-1.18-10.88 47.82 47.82 0 0 1 82.72-32.75 94.1 94.1 0 0 0 30.34-11.62 47.95 47.95 0 0 1-21 26.38 96.2 96.2 0 0 0 27.46-7.5 102.8 102.8 0 0 1-24.28 24.88",
    },
  ],
  weblink: [
    {
      d: "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m87.63 96h-39.84c-1.1-27.43-8.41-53.23-20.41-70.89A88.2 88.2 0 0 1 215.63 120M128 216c-13.53 0-29.64-30.44-31.79-80h63.58C157.64 185.56 141.53 216 128 216M96.21 120C98.36 70.44 114.47 40 128 40s29.64 30.44 31.79 80Zm4.41-70.89C88.62 66.77 81.31 92.57 80.21 120H40.37a88.2 88.2 0 0 1 60.25-70.89M40.37 136h39.84c1.1 27.43 8.41 53.23 20.41 70.89A88.2 88.2 0 0 1 40.37 136m115 70.89c12-17.66 19.31-43.46 20.41-70.89h39.84a88.2 88.2 0 0 1-60.24 70.89",
    },
  ],
  x: [
    {
      d: "M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z",
    },
  ],
  "atomic-note": [
    {
      d: "M208 88H48a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-96a16 16 0 0 0-16-16m0 112H48v-96h160zM48 64a8 8 0 0 1 8-8h144a8 8 0 0 1 0 16H56a8 8 0 0 1-8-8m16-32a8 8 0 0 1 8-8h112a8 8 0 0 1 0 16H72a8 8 0 0 1-8-8",
    },
  ],
  quote: [
    {
      d: "M100 56H40a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h60v8a32 32 0 0 1-32 32a8 8 0 0 0 0 16 48.05 48.05 0 0 0 48-48V72a16 16 0 0 0-16-16m0 80H40V72h60Zm116-80h-60a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h60v8a32 32 0 0 1-32 32a8 8 0 0 0 0 16 48.05 48.05 0 0 0 48-48V72a16 16 0 0 0-16-16m0 80h-60V72h60Z",
    },
  ],
  page: [
    {
      d: "m213.66 82.34-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31 188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48zm-32-80a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8",
    },
  ],
  dots: [
    {
      d: "M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16m-84-16a16 16 0 1 0 16 16a16 16 0 0 0-16-16m136 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16",
    },
  ],
};

function createAppSidebarIcon(name: AppSidebarIconName) {
  return function CreatedAppSidebarIcon(props: Omit<AppSidebarIconProps, "name">) {
    return <AppSidebarIcon name={name} {...props} />;
  };
}

function AppSidebarIcon({ name, className, children, ...props }: AppSidebarIconProps) {
  if (name === "flask") {
    return (
      <svg
        data-slot="app-sidebar-icon"
        data-icon-name={name}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn("size-4", className)}
        {...props}
      >
        {children}
      </svg>
    );
  }

  return (
    <svg
      data-slot="app-sidebar-icon"
      data-icon-name={name}
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      {iconPaths[name].map((path) => (
        <path key={path.d} d={path.d} opacity={path.opacity} />
      ))}
    </svg>
  );
}

function AppSidebarPlusIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="plus" {...props} />;
}

function AppSidebarSearchIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="search" {...props} />;
}

function AppSidebarExploreIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="explore" {...props} />;
}

function AppSidebarCalendarIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="calendar" {...props} />;
}

const AppSidebarArchiveIcon = createAppSidebarIcon("archive");
const AppSidebarAlertIcon = createAppSidebarIcon("alert");
const AppSidebarArrowDownIcon = createAppSidebarIcon("arrow-down");
const AppSidebarArrowUpIcon = createAppSidebarIcon("arrow-up");
const AppSidebarAudioIcon = createAppSidebarIcon("audio");
const AppSidebarBookIcon = createAppSidebarIcon("book");
const AppSidebarChevronRightIcon = createAppSidebarIcon("chevron-right");
const AppSidebarChevronsUpDownIcon = createAppSidebarIcon("chevrons-up-down");
const AppSidebarCheckIcon = createAppSidebarIcon("check");
const AppSidebarCodeIcon = createAppSidebarIcon("code");
const AppSidebarCornerDownLeftIcon = createAppSidebarIcon("corner-down-left");
const AppSidebarCopyIcon = createAppSidebarIcon("copy");
const AppSidebarFileIcon = createAppSidebarIcon("file");
const AppSidebarGripVerticalIcon = createAppSidebarIcon("grip-vertical");
const AppSidebarImageIcon = createAppSidebarIcon("image");
const AppSidebarIdeaIcon = createAppSidebarIcon("idea");
const AppSidebarKnowledgeIcon = createAppSidebarIcon("knowledge");
const AppSidebarPdfIcon = createAppSidebarIcon("pdf");
const AppSidebarPinOffIcon = createAppSidebarIcon("pin-off");
const AppSidebarProjectIcon = createAppSidebarIcon("project");
const AppSidebarSunIcon = createAppSidebarIcon("sun");
const AppSidebarTableIcon = createAppSidebarIcon("table");
const AppSidebarTaskIcon = createAppSidebarIcon("task");
const AppSidebarTweetIcon = createAppSidebarIcon("tweet");
const AppSidebarWeblinkIcon = createAppSidebarIcon("weblink");
const AppSidebarXIcon = createAppSidebarIcon("x");

function AppSidebarPinIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="pin" {...props} />;
}

function AppSidebarObjectsIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="objects" {...props} />;
}

function AppSidebarFlaskIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="flask" {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v5.2L5.6 17a2.5 2.5 0 0 0 2.2 3.7h8.4a2.5 2.5 0 0 0 2.2-3.7L14 8.2V3" />
      <path d="M7.6 15h8.8" />
    </AppSidebarIcon>
  );
}

function AppSidebarAtomicNoteIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="atomic-note" {...props} />;
}

function AppSidebarQuoteIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="quote" {...props} />;
}

function AppSidebarPageIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="page" {...props} />;
}

function AppSidebarDotsIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="dots" {...props} />;
}

export {
  AppSidebarAlertIcon,
  AppSidebarArchiveIcon,
  AppSidebarArrowDownIcon,
  AppSidebarArrowUpIcon,
  AppSidebarAtomicNoteIcon,
  AppSidebarAudioIcon,
  AppSidebarBookIcon,
  AppSidebarCalendarIcon,
  AppSidebarCheckIcon,
  AppSidebarChevronRightIcon,
  AppSidebarChevronsUpDownIcon,
  AppSidebarCodeIcon,
  AppSidebarCopyIcon,
  AppSidebarCornerDownLeftIcon,
  AppSidebarDotsIcon,
  AppSidebarExploreIcon,
  AppSidebarFileIcon,
  AppSidebarFlaskIcon,
  AppSidebarGripVerticalIcon,
  AppSidebarIcon,
  type AppSidebarIconName,
  type AppSidebarIconProps,
  AppSidebarIdeaIcon,
  AppSidebarImageIcon,
  AppSidebarKnowledgeIcon,
  AppSidebarObjectsIcon,
  AppSidebarPageIcon,
  AppSidebarPdfIcon,
  AppSidebarPinIcon,
  AppSidebarPinOffIcon,
  AppSidebarPlusIcon,
  AppSidebarProjectIcon,
  AppSidebarQuoteIcon,
  AppSidebarSearchIcon,
  AppSidebarSunIcon,
  AppSidebarTableIcon,
  AppSidebarTaskIcon,
  AppSidebarTweetIcon,
  AppSidebarWeblinkIcon,
  AppSidebarXIcon,
};
