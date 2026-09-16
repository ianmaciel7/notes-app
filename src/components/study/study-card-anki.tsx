"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudyRatingBar } from "@/components/study/study-rating-bar";
import type { CardRecord, CardSchedule, StudyRating } from "@/data/types";
import { cn } from "@/lib/utils";

export interface StudyCardAnkiProps extends React.ComponentProps<typeof Card> {
  card: CardRecord;
  schedule?: CardSchedule;
  now?: Date;
  disabled?: boolean;
  onRate: (rating: StudyRating) => void;
}

export function StudyCardAnki({
  card,
  schedule,
  now = new Date(),
  disabled = false,
  onRate,
  className,
  ...props
}: StudyCardAnkiProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      if (!revealed && event.code === "Space") {
        event.preventDefault();
        setRevealed(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [disabled, revealed]);

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)} {...props}>
      <Card className="min-h-[350px] flex flex-col justify-center text-center shadow-lg border-border">
        <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6">
          <div className="flex flex-col items-center space-y-3 w-full">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                Flashcard · Anki
              </Badge>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pergunta</span>
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
        <StudyRatingBar
          schedule={schedule}
          now={now}
          disabled={disabled}
          onRate={onRate}
        />
      )}
    </div>
  );
}
