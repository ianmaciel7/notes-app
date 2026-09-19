"use client";

import { CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/question";

interface MultiChoiceQuestionProps {
  options: QuestionOption[];
  selectedAnswer?: string[];
  onSelectAnswer?: (selectedIds: string[]) => void;
  isRevealed?: boolean;
  correctAnswer?: string[];
  maxSelections?: number;
  disabled?: boolean;
}

export function MultiChoiceQuestion({
  options,
  selectedAnswer = [],
  onSelectAnswer,
  isRevealed = false,
  correctAnswer = [],
  maxSelections,
  disabled = false,
}: MultiChoiceQuestionProps) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const targetCount = maxSelections ?? correctAnswer.length ?? 2;
  const currentCount = selectedAnswer.length;

  const handleToggle = (optionId: string) => {
    if (disabled || isRevealed || !onSelectAnswer) return;

    if (selectedAnswer.includes(optionId)) {
      onSelectAnswer(selectedAnswer.filter((id) => id !== optionId));
    } else {
      if (targetCount > 0 && selectedAnswer.length >= targetCount) {
        const next = [...selectedAnswer.slice(1), optionId];
        onSelectAnswer(next);
      } else {
        onSelectAnswer([...selectedAnswer, optionId]);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Target constraint indicator banner */}
      <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <InfoIcon className="size-3.5 text-primary" />
          <span>
            Select {targetCount > 0 ? targetCount : "all that apply"}{" "}
            {targetCount === 1 ? "option" : "options"}
          </span>
        </span>
        <span className="font-mono">
          {currentCount} of {targetCount} selected
        </span>
      </div>

      <div className="grid gap-3">
        {options.map((option, index) => {
          const letter = letters[index] ?? String(index + 1);
          const isSelected = selectedAnswer.includes(option.id);
          const isCorrect = correctAnswer.includes(option.id);

          const isRevealedCorrect = isRevealed && isCorrect && isSelected;
          const isRevealedMissed = isRevealed && isCorrect && !isSelected;
          const isRevealedWrong = isRevealed && !isCorrect && isSelected;

          let cardBorderClass = "border-border hover:border-foreground/30";
          if (isSelected && !isRevealed) {
            cardBorderClass = "border-primary bg-primary/5 ring-1 ring-primary";
          } else if (isRevealedCorrect) {
            cardBorderClass =
              "border-emerald-600 bg-emerald-500/10 dark:border-emerald-500";
          } else if (isRevealedMissed) {
            cardBorderClass =
              "border-emerald-600/70 border-dashed bg-emerald-500/5";
          } else if (isRevealedWrong) {
            cardBorderClass =
              "border-destructive bg-destructive/10 dark:border-destructive";
          }

          return (
            <label
              key={option.id}
              htmlFor={`chk-${option.id}`}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors",
                cardBorderClass,
                disabled || isRevealed ? "cursor-default" : "",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox
                    id={`chk-${option.id}`}
                    checked={isSelected}
                    disabled={disabled || isRevealed}
                    onCheckedChange={() => handleToggle(option.id)}
                    aria-label={`Select ${option.text}`}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-medium text-sm text-foreground">
                      <span className="inline-flex size-5 items-center justify-center rounded bg-muted text-xs font-semibold text-muted-foreground">
                        {letter}
                      </span>
                      <span>{option.text}</span>
                    </span>

                    {isRevealedCorrect && (
                      <Badge className="gap-1 border-emerald-600 bg-emerald-600 text-white">
                        <CheckCircle2Icon className="size-3.5" />
                        Correct
                      </Badge>
                    )}

                    {isRevealedMissed && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-emerald-600 text-emerald-700 dark:text-emerald-400"
                      >
                        <CheckCircle2Icon className="size-3.5" />
                        Missed
                      </Badge>
                    )}

                    {isRevealedWrong && (
                      <Badge variant="destructive" className="gap-1">
                        <XCircleIcon className="size-3.5" />
                        Incorrect
                      </Badge>
                    )}
                  </div>

                  {isRevealed && option.explanation && (
                    <div
                      className={cn(
                        "mt-2 rounded-md p-2.5 text-xs leading-relaxed",
                        isCorrect
                          ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200"
                          : isSelected
                            ? "bg-destructive/15 text-destructive dark:text-red-300"
                            : "bg-muted/70 text-muted-foreground",
                      )}
                    >
                      {option.explanation}
                    </div>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
