"use client";

import { useState } from "react";
import { CheckCircle2, FileQuestion, HelpCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudyRatingBar } from "@/components/study/study-rating-bar";
import type { CardRecord, CardSchedule, StudyRating } from "@/data/types";
import { cn } from "@/lib/utils";

export interface StudyCardExamTopicProps extends React.ComponentProps<typeof Card> {
  card: CardRecord;
  schedule?: CardSchedule;
  now?: Date;
  disabled?: boolean;
  onRate: (rating: StudyRating) => void;
}

const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function StudyCardExamTopic({
  card,
  schedule,
  now = new Date(),
  disabled = false,
  onRate,
  className,
  ...props
}: StudyCardExamTopicProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = card.options ?? [];
  const correctOption = options.find((opt) => opt.isCorrect);
  const isSelectedCorrect = selectedOptionId ? correctOption?.id === selectedOptionId : false;

  function handleSelect(optionId: string) {
    if (submitted || disabled) return;
    setSelectedOptionId(optionId);
  }

  function handleVerify() {
    if (!selectedOptionId || disabled) return;
    setSubmitted(true);
  }

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)} {...props}>
      <Card className="min-h-[350px] flex flex-col justify-between shadow-lg border-border overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-[11px] font-semibold text-foreground">
                <FileQuestion className="size-3 text-primary" />
                <span>ExamTopics · Simulado</span>
              </Badge>
              <span className="text-xs text-muted-foreground">
                {options.length ? `${options.length} alternativas` : "Questão dissertativa"}
              </span>
            </div>

            {submitted ? (
              <Badge
                variant={isSelectedCorrect ? "default" : "destructive"}
                className="text-xs font-semibold"
              >
                {isSelectedCorrect ? "Acertou!" : "Errou!"}
              </Badge>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 flex flex-col flex-1 space-y-6">
          {/* Question text */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Enunciado</span>
            <p className="text-base sm:text-lg font-semibold leading-relaxed text-foreground whitespace-pre-wrap">
              {card.front}
            </p>
          </div>

          {/* Options list */}
          {options.length > 0 ? (
            <div className="space-y-2.5 pt-2" role="radiogroup" aria-label="Alternativas">
              {options.map((option, index) => {
                const isSelected = selectedOptionId === option.id;
                const letter = optionLetters[index] ?? String(index + 1);

                let optionStyle =
                  "border-border bg-card hover:bg-secondary/50 text-foreground";

                if (isSelected && !submitted) {
                  optionStyle = "border-primary ring-2 ring-primary/20 bg-primary/5 text-foreground";
                } else if (submitted) {
                  if (option.isCorrect) {
                    optionStyle =
                      "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20";
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle =
                      "border-destructive bg-destructive/10 text-destructive ring-2 ring-destructive/20";
                  } else {
                    optionStyle = "border-border/40 opacity-50 bg-card text-muted-foreground";
                  }
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={submitted || disabled}
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      "w-full p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer disabled:cursor-default",
                      optionStyle,
                    )}
                  >
                    <span
                      className={cn(
                        "size-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                        isSelected && !submitted
                          ? "bg-primary text-primary-foreground border-primary"
                          : submitted && option.isCorrect
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : submitted && isSelected && !option.isCorrect
                          ? "bg-destructive text-destructive-foreground border-destructive"
                          : "border-border text-muted-foreground bg-muted/40",
                      )}
                    >
                      {letter}
                    </span>
                    <span className="text-sm font-medium leading-normal flex-1">
                      {option.text}
                    </span>
                    {submitted && option.isCorrect ? (
                      <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : null}
                    {submitted && isSelected && !option.isCorrect ? (
                      <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground">
              Esta questão não possui alternativas cadastradas. Clique em mostrar resposta para conferir o gabarito.
            </div>
          )}

          {/* Explanation / Rationale after submit */}
          {submitted ? (
            <div className="pt-4 border-t border-border space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <HelpCircle className="size-3.5" />
                <span>Gabarito & Justificativa Técnica</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap font-medium">
                {card.explanation || card.back}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!submitted ? (
        <Button
          className="w-full min-h-13 text-base font-semibold gap-2 shadow-sm"
          type="button"
          disabled={disabled || (options.length > 0 && !selectedOptionId)}
          onClick={options.length > 0 ? handleVerify : () => setSubmitted(true)}
        >
          <CheckCircle2 size={18} />
          <span>Verificar resposta</span>
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
