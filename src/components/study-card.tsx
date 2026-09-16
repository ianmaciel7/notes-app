"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { previewRatings } from "@/domain/scheduler";
import type { CardRecord, CardSchedule, StudyRating } from "@/data/types";
import { cn } from "@/lib/utils";

const labels: Record<StudyRating, string> = {
  again: "Novamente",
  hard: "Difícil",
  good: "Bom",
  easy: "Fácil",
};

const ratingButtonStyles: Record<StudyRating, string> = {
  again: "border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50",
  hard: "border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50",
  good: "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50",
  easy: "border-border text-foreground hover:bg-secondary hover:border-border",
};

interface StudyCardProps {
  card: CardRecord;
  schedule?: CardSchedule;
  now?: Date;
  disabled?: boolean;
  onRate: (rating: StudyRating) => void;
}

export function StudyCard({ card, schedule, now = new Date(), disabled = false, onRate }: StudyCardProps) {
  const [revealed, setRevealed] = useState(false);
  const previews = useMemo(() => previewRatings(schedule, now), [schedule, now]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      if (!revealed && event.code === "Space") {
        event.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed && ["1", "2", "3", "4"].includes(event.key)) {
        const rating = (["again", "hard", "good", "easy"] as StudyRating[])[Number(event.key) - 1];
        onRate(rating);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [disabled, onRate, revealed]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <Card className="min-h-[350px] flex flex-col justify-center text-center shadow-lg border-border">
        <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6">
          <div className="flex flex-col items-center space-y-3 w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Pergunta</span>
            <p className="text-2xl sm:text-3xl font-semibold max-w-2xl leading-relaxed text-foreground whitespace-pre-wrap">
              {card.front}
            </p>
          </div>

          {revealed ? (
            <div className="w-full pt-8 mt-2 border-t border-border flex flex-col items-center space-y-3 animate-in fade-in-50 duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Resposta</span>
              <p className="text-xl sm:text-2xl font-medium max-w-2xl leading-relaxed text-foreground whitespace-pre-wrap">
                {card.back}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!revealed ? (
        <Button
          className="w-full min-h-13 text-base font-semibold gap-2 shadow-sm"
          type="button"
          disabled={disabled}
          onClick={() => setRevealed(true)}
        >
          <Eye size={18} />
          <span>Mostrar resposta</span>
        </Button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" aria-label="Avaliar resposta">
          {previews.map((preview, index) => (
            <Button
              variant="outline"
              className={cn(
                "min-h-16 flex flex-col items-center justify-center gap-1 font-semibold transition-colors",
                ratingButtonStyles[preview.rating]
              )}
              type="button"
              disabled={disabled}
              key={preview.rating}
              onClick={() => onRate(preview.rating)}
            >
              <span className="text-sm">{labels[preview.rating]}</span>
              <small className="text-[10px] font-medium opacity-80">
                {index + 1} · {preview.intervalLabel}
              </small>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
