"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, MessageSquareQuote, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudyRatingBar } from "@/components/study/study-rating-bar";
import type { CardRecord, CardSchedule, StudyRating } from "@/data/types";
import { cn } from "@/lib/utils";

export interface StudyCardReadwiseProps extends React.ComponentProps<typeof Card> {
  card: CardRecord;
  schedule?: CardSchedule;
  now?: Date;
  disabled?: boolean;
  onRate: (rating: StudyRating) => void;
}

export function StudyCardReadwise({
  card,
  schedule,
  now = new Date(),
  disabled = false,
  onRate,
  className,
  ...props
}: StudyCardReadwiseProps) {
  const [revealed, setRevealed] = useState(!card.back);

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
      <Card className="min-h-[350px] flex flex-col justify-between shadow-lg border-border overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-[11px] font-semibold text-foreground">
                <BookOpen className="size-3 text-primary" />
                <span>Readwise · Highlight</span>
              </Badge>
              {card.sourceTitle ? (
                <span className="text-xs font-medium text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                  {card.sourceTitle}
                </span>
              ) : null}
            </div>

            {card.sourceUrl ? (
              <a
                href={card.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                title="Abrir fonte original"
              >
                <span>Fonte</span>
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="p-8 sm:p-10 flex flex-col justify-center flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MessageSquareQuote className="size-7 text-primary/40 shrink-0 mt-1" />
              <blockquote className="text-xl sm:text-2xl font-serif italic leading-relaxed text-foreground whitespace-pre-wrap">
                “{card.front}”
              </blockquote>
            </div>

            {card.sourceAuthor ? (
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground tracking-wide text-right">
                — {card.sourceAuthor}
              </p>
            ) : null}
          </div>

          {card.back ? (
            revealed ? (
              <div className="pt-6 border-t border-border flex flex-col space-y-2 animate-in fade-in-50 duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="size-3.5" />
                  <span>Anotação & Insight</span>
                </div>
                <p className="text-sm sm:text-base font-normal leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {card.back}
                </p>
              </div>
            ) : null
          ) : null}
        </CardContent>
      </Card>

      {!revealed && card.back ? (
        <Button
          className="w-full min-h-13 text-base font-semibold gap-2 shadow-sm"
          type="button"
          disabled={disabled}
          onClick={() => setRevealed(true)}
        >
          <Sparkles size={18} />
          <span>Ver anotações & avaliar</span>
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
