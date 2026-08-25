"use client";

import type {
  DataViewLayoutSwitcherProps,
  ObjectViewLayoutSwitcherProps,
} from "@/components/object-view-types";
import { cn } from "@/lib/utils";
import {
  DATA_VIEW_KINDS,
  OBJECT_VIEW_KINDS,
} from "@/lib/workspace-object-views";

function KindSwitcher<TKind extends string>({
  ariaLabel,
  kinds,
  labels,
  onValueChange,
  value,
}: {
  readonly ariaLabel: string;
  readonly kinds: readonly TKind[];
  readonly labels: Readonly<Partial<Record<TKind, string>>>;
  readonly onValueChange: (kind: TKind) => void;
  readonly value: TKind;
}) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-1 rounded-md border bg-muted/40 p-1"
    >
      {kinds
        .filter((kind) => labels[kind])
        .map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={value === kind}
            className={cn(
              "rounded px-2 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === kind
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onValueChange(kind)}
          >
            {labels[kind]}
          </button>
        ))}
    </div>
  );
}

function DataViewLayoutSwitcher({
  kinds = DATA_VIEW_KINDS,
  ...props
}: DataViewLayoutSwitcherProps) {
  return <KindSwitcher {...props} kinds={kinds} />;
}

function ObjectViewLayoutSwitcher(props: ObjectViewLayoutSwitcherProps) {
  return <KindSwitcher {...props} kinds={OBJECT_VIEW_KINDS} />;
}

export { DataViewLayoutSwitcher, ObjectViewLayoutSwitcher };
