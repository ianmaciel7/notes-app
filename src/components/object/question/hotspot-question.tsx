"use client";

import { CheckCircle2Icon, CrosshairIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HotspotArea } from "@/types/question";

interface HotspotQuestionProps {
  imageUrl?: string;
  areas?: HotspotArea[];
  selectedAnswer?: string[];
  onSelectAnswer?: (selectedIds: string[]) => void;
  isRevealed?: boolean;
  correctAnswer?: string[];
  disabled?: boolean;
}

export function HotspotQuestion({
  imageUrl,
  areas = [],
  selectedAnswer = [],
  onSelectAnswer,
  isRevealed = false,
  correctAnswer = [],
  disabled = false,
}: HotspotQuestionProps) {
  const handleToggle = (areaId: string) => {
    if (disabled || isRevealed || !onSelectAnswer) return;

    if (selectedAnswer.includes(areaId)) {
      onSelectAnswer(selectedAnswer.filter((id) => id !== areaId));
    } else {
      // Hotspots typically allow 1 target area or multiple
      const isMultiple = correctAnswer.length > 1;
      if (isMultiple) {
        onSelectAnswer([...selectedAnswer, areaId]);
      } else {
        onSelectAnswer([areaId]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Diagram with interactive bounding boxes */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted/10 shadow-inner">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Question Diagram"
            fill
            className="object-contain pointer-events-none select-none"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <CrosshairIcon className="size-8" />
            <span className="ml-2 text-sm">Diagram viewport</span>
          </div>
        )}

        {/* Hotspot bounding box overlays */}
        {areas.map((area) => {
          const [x, y, width, height] = area.coordinates;
          const isSelected = selectedAnswer.includes(area.id);
          const isCorrect = correctAnswer.includes(area.id);

          const isRevealedCorrect = isRevealed && isCorrect;
          const isRevealedWrong = isRevealed && !isCorrect && isSelected;

          let areaStyleClass =
            "border border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/20";
          if (isSelected && !isRevealed) {
            areaStyleClass =
              "border-2 border-primary bg-primary/30 shadow-md ring-2 ring-primary/40";
          } else if (isRevealedCorrect) {
            areaStyleClass =
              "border-2 border-emerald-600 bg-emerald-500/35 shadow-sm";
          } else if (isRevealedWrong) {
            areaStyleClass =
              "border-2 border-destructive bg-destructive/35 shadow-sm";
          }

          return (
            <button
              key={area.id}
              type="button"
              disabled={disabled || isRevealed}
              onClick={() => handleToggle(area.id)}
              aria-label={area.label || `Hotspot area ${area.id}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              className={cn(
                "absolute cursor-pointer rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                areaStyleClass,
                (disabled || isRevealed) && "cursor-default",
              )}
            >
              {/* Inner indicator badge */}
              <div className="flex h-full w-full items-center justify-center p-1">
                {isRevealed && isRevealedCorrect && (
                  <span className="flex items-center gap-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    <CheckCircle2Icon className="size-3" />
                    Correct Target
                  </span>
                )}
                {isRevealed && isRevealedWrong && (
                  <span className="flex items-center gap-1 rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    <XCircleIcon className="size-3" />
                    Incorrect
                  </span>
                )}
                {!isRevealed && isSelected && (
                  <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-xs">
                    Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Area selector buttons for accessibility & quick clicking */}
      <div className="space-y-2">
        <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
          Diagram Components (Click diagram or select below):
        </span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {areas.map((area) => {
            const isSelected = selectedAnswer.includes(area.id);
            const isCorrect = correctAnswer.includes(area.id);

            const isRevealedCorrect = isRevealed && isCorrect;
            const isRevealedWrong = isRevealed && !isCorrect && isSelected;

            return (
              <button
                key={area.id}
                type="button"
                disabled={disabled || isRevealed}
                onClick={() => handleToggle(area.id)}
                className={cn(
                  "flex items-center justify-between rounded-md border p-2.5 text-left text-xs transition-colors",
                  isSelected && !isRevealed
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:bg-muted/50",
                  isRevealedCorrect &&
                    "border-emerald-600 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-medium",
                  isRevealedWrong &&
                    "border-destructive bg-destructive/10 text-destructive dark:text-red-300 font-medium",
                )}
              >
                <span className="truncate">{area.label || area.id}</span>
                {isRevealedCorrect && (
                  <Badge className="border-emerald-600 bg-emerald-600 text-white">
                    Correct
                  </Badge>
                )}
                {isRevealedWrong && (
                  <Badge variant="destructive">Selected (Incorrect)</Badge>
                )}
                {!isRevealed && isSelected && (
                  <Badge variant="default">Selected</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
