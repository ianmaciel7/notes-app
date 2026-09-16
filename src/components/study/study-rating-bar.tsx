"use client";

import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { previewRatings } from "@/domain/scheduler";
import type { CardSchedule, StudyRating } from "@/data/types";
import { cn } from "@/lib/utils";

const labels: Record<StudyRating, string> = {
  again: "Novamente",
  hard: "Difícil",
  good: "Bom",
  easy: "Fácil",
};

const ratingButtonStyles: Record<StudyRating, string> = {
  again: "border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50",
  hard: "border-border text-foreground hover:bg-secondary/60 hover:border-border",
  good: "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50",
  easy: "border-border text-foreground hover:bg-secondary hover:border-border",
};

export interface StudyRatingBarProps {
  schedule?: CardSchedule;
  now?: Date;
  disabled?: boolean;
  onRate: (rating: StudyRating) => void;
  className?: string;
}

export function StudyRatingBar({
  schedule,
  now = new Date(),
  disabled = false,
  onRate,
  className,
}: StudyRatingBarProps) {
  const previews = useMemo(() => previewRatings(schedule, now), [schedule, now]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (["1", "2", "3", "4"].includes(event.key)) {
        const rating = (["again", "hard", "good", "easy"] as StudyRating[])[Number(event.key) - 1];
        if (rating) {
          event.preventDefault();
          onRate(rating);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [disabled, onRate]);

  return (
    <div
      className={cn("grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full", className)}
      aria-label="Avaliar resposta"
    >
      {previews.map((preview, index) => (
        <Button
          key={preview.rating}
          variant="outline"
          className={cn(
            "min-h-16 flex flex-col items-center justify-center gap-1 font-semibold transition-colors",
            ratingButtonStyles[preview.rating],
          )}
          type="button"
          disabled={disabled}
          onClick={() => onRate(preview.rating)}
        >
          <span className="text-sm">{labels[preview.rating]}</span>
          <small className="text-[10px] font-medium opacity-80">
            {index + 1} · {preview.intervalLabel}
          </small>
        </Button>
      ))}
    </div>
  );
}
