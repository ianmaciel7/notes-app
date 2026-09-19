"use client";

import { LayoutListIcon, PanelTopIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssessmentViewMode } from "@/types/assessment";

export function AssessmentToolbar({
  mode,
  onModeChange,
  error,
  labels,
}: {
  mode: AssessmentViewMode;
  onModeChange: (mode: AssessmentViewMode) => void;
  error?: string;
  labels: {
    view: string;
    continuous: string;
    focus: string;
  };
}) {
  return (
    <div className="md:sticky md:top-0 md:z-20 md:-mx-6 md:px-6 md:py-3 md:bg-muted/95 md:backdrop-blur">
      <div className="flex min-h-10 items-center justify-between gap-3 rounded-lg border bg-background/95 px-2 py-1.5 shadow-xs">
        <span className="px-2 text-xs font-medium text-muted-foreground">
          {labels.view}
        </span>
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">Assessment view</legend>
          <Button
            type="button"
            size="sm"
            variant={mode === "continuous" ? "secondary" : "ghost"}
            aria-pressed={mode === "continuous"}
            onClick={() => onModeChange("continuous")}
            className="h-8 gap-1.5 text-xs"
          >
            <LayoutListIcon className="size-3.5" />
            {labels.continuous}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "focus" ? "secondary" : "ghost"}
            aria-pressed={mode === "focus"}
            onClick={() => onModeChange("focus")}
            className="h-8 gap-1.5 text-xs"
          >
            <PanelTopIcon className="size-3.5" />
            {labels.focus}
          </Button>
        </fieldset>
        <p
          className="min-w-0 flex-1 truncate text-right text-xs text-destructive"
          aria-live="polite"
        >
          {error ?? ""}
        </p>
      </div>
    </div>
  );
}
