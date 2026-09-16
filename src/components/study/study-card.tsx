"use client";

import { Card } from "@/components/ui/card";
import { StudyCardAnki } from "@/components/study/study-card-anki";
import { StudyCardExamTopic } from "@/components/study/study-card-exam-topic";
import { StudyCardReadwise } from "@/components/study/study-card-readwise";
import type { CardRecord, CardSchedule, StudyRating } from "@/data/types";

export interface StudyCardProps extends React.ComponentProps<typeof Card> {
  card: CardRecord;
  schedule?: CardSchedule;
  now?: Date;
  disabled?: boolean;
  onRate: (rating: StudyRating) => void;
}

export function StudyCard({
  card,
  schedule,
  now = new Date(),
  disabled = false,
  onRate,
  className,
  ...props
}: StudyCardProps) {
  const cardType = card.type ?? "anki";

  switch (cardType) {
    case "readwise":
      return (
        <StudyCardReadwise
          card={card}
          schedule={schedule}
          now={now}
          disabled={disabled}
          onRate={onRate}
          className={className}
          {...props}
        />
      );
    case "exam_topic":
      return (
        <StudyCardExamTopic
          card={card}
          schedule={schedule}
          now={now}
          disabled={disabled}
          onRate={onRate}
          className={className}
          {...props}
        />
      );
    case "anki":
    default:
      return (
        <StudyCardAnki
          card={card}
          schedule={schedule}
          now={now}
          disabled={disabled}
          onRate={onRate}
          className={className}
          {...props}
        />
      );
  }
}
