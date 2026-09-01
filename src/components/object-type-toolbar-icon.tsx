import type { Icon } from "@phosphor-icons/react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react/dist/csr/ClockCounterClockwise";
import { DotsSixVerticalIcon } from "@phosphor-icons/react/dist/csr/DotsSixVertical";
import { FunnelIcon } from "@phosphor-icons/react/dist/csr/Funnel";
import { GridFourIcon } from "@phosphor-icons/react/dist/csr/GridFour";
import { HashIcon } from "@phosphor-icons/react/dist/csr/Hash";
import { LinkBreakIcon } from "@phosphor-icons/react/dist/csr/LinkBreak";
import { ListBulletsIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { ListMagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/ListMagnifyingGlass";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { RowsIcon } from "@phosphor-icons/react/dist/csr/Rows";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { SortDescendingIcon } from "@phosphor-icons/react/dist/csr/SortDescending";
import { SquareIcon } from "@phosphor-icons/react/dist/csr/Square";
import { StackIcon } from "@phosphor-icons/react/dist/csr/Stack";
import { TagIcon } from "@phosphor-icons/react/dist/csr/Tag";
import type * as React from "react";

import { cn } from "@/lib/utils";

type ObjectTypeToolbarIconName =
  | "overview"
  | "all"
  | "add"
  | "count"
  | "filter"
  | "group"
  | "sort"
  | "list"
  | "grid"
  | "caret"
  | "recent"
  | "collection"
  | "query"
  | "no-collection"
  | "untagged"
  | "no-backlinks"
  | "drag"
  | "check";

type ObjectTypeToolbarIconProps = React.ComponentProps<"svg"> & {
  name: ObjectTypeToolbarIconName;
};

const objectTypeToolbarIcon: Record<ObjectTypeToolbarIconName, Icon> = {
  add: PlusIcon,
  all: ListBulletsIcon,
  caret: CaretDownIcon,
  check: CheckIcon,
  collection: StackIcon,
  count: HashIcon,
  drag: DotsSixVerticalIcon,
  filter: FunnelIcon,
  grid: GridFourIcon,
  group: SlidersHorizontalIcon,
  list: RowsIcon,
  "no-backlinks": LinkBreakIcon,
  "no-collection": SquareIcon,
  overview: RowsIcon,
  query: ListMagnifyingGlassIcon,
  recent: ClockCounterClockwiseIcon,
  sort: SortDescendingIcon,
  untagged: TagIcon,
};

function ObjectTypeToolbarIcon({
  name,
  className,
  ...props
}: ObjectTypeToolbarIconProps) {
  const PhosphorIcon = objectTypeToolbarIcon[name];

  return (
    <PhosphorIcon
      data-slot="object-type-toolbar-icon"
      data-icon-name={name}
      weight="regular"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

export {
  ObjectTypeToolbarIcon,
  type ObjectTypeToolbarIconName,
  type ObjectTypeToolbarIconProps,
};
