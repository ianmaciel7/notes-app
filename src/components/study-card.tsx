"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { previewRatings } from "@/lib/scheduler";
import type { CardRecord, CardSchedule, StudyRating } from "@/lib/types";

const labels: Record<StudyRating, string> = {
  again: "Novamente",
  hard: "Difícil",
  good: "Bom",
  easy: "Fácil",
};

interface StudyCardProps {
  card: CardRecord;
  schedule?: CardSchedule;
  now?: Date;
  onRate: (rating: StudyRating) => void;
}

export function StudyCard({ card, schedule, now = new Date(), onRate }: StudyCardProps) {
  const [revealed, setRevealed] = useState(false);
  const previews = useMemo(() => previewRatings(schedule, now), [schedule, now]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
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
  }, [onRate, revealed]);

  return (
    <div className="study-card-wrap">
      <Card className={`flashcard ${revealed ? "flashcard-revealed" : ""}`}>
        <div className="card-face">
          <span className="card-side-label">Pergunta</span>
          <p>{card.front}</p>
        </div>
        {revealed ? (
          <div className="card-face card-answer">
            <span className="card-side-label">Resposta</span>
            <p>{card.back}</p>
          </div>
        ) : null}
      </Card>

      {!revealed ? (
        <Button className="reveal-button" type="button" onClick={() => setRevealed(true)}><Eye />Mostrar resposta</Button>
      ) : (
        <div className="rating-grid" aria-label="Avaliar resposta">
          {previews.map((preview, index) => (
            <Button variant="outline" className={`rating-button rating-${preview.rating}`} type="button" key={preview.rating} onClick={() => onRate(preview.rating)}>
              <span>{labels[preview.rating]}</span>
              <small>{index + 1} · {preview.intervalLabel}</small>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
