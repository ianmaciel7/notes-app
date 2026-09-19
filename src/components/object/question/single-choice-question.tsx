"use client";

import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/question";

interface SingleChoiceQuestionProps {
  options: QuestionOption[];
  selectedAnswer?: string;
  onSelectAnswer?: (optionId: string) => void;
  isRevealed?: boolean;
  correctAnswer?: string;
  disabled?: boolean;
}

export function SingleChoiceQuestion({
  options,
  selectedAnswer,
  onSelectAnswer,
  isRevealed = false,
  correctAnswer,
  disabled = false,
}: SingleChoiceQuestionProps) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div className="space-y-3">
      <RadioGroup
        value={selectedAnswer ?? ""}
        onValueChange={(val) => {
          if (!disabled && onSelectAnswer) {
            onSelectAnswer(val);
          }
        }}
        disabled={disabled || isRevealed}
        className="gap-3"
      >
        {options.map((option, index) => {
          const letter = letters[index] ?? String(index + 1);
          const isSelected = selectedAnswer === option.id;
          const isOptionCorrect = isRevealed && correctAnswer === option.id;
          const isOptionWrongSelected =
            isRevealed && isSelected && correctAnswer !== option.id;

          let cardBorderClass = "border-border hover:border-foreground/30";
          if (isSelected && !isRevealed) {
            cardBorderClass = "border-primary bg-primary/5 ring-1 ring-primary";
          } else if (isOptionCorrect) {
            cardBorderClass = "border-primary bg-primary/10";
          } else if (isOptionWrongSelected) {
            cardBorderClass =
              "border-destructive bg-destructive/10 dark:border-destructive";
          }

          return (
            <label
              key={option.id}
              htmlFor={`option-${option.id}`}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors",
                cardBorderClass,
                disabled || isRevealed ? "cursor-default" : "",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <RadioGroupItem
                    id={`option-${option.id}`}
                    value={option.id}
                    disabled={disabled || isRevealed}
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

                    {isRevealed && isOptionCorrect && (
                      <Badge className="gap-1">
                        <CheckCircle2Icon className="size-3.5" />
                        Correct
                      </Badge>
                    )}

                    {isRevealed && isOptionWrongSelected && (
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
                        isOptionCorrect
                          ? "bg-primary/10 text-foreground"
                          : isOptionWrongSelected
                            ? "bg-destructive/10 text-destructive"
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
      </RadioGroup>
    </div>
  );
}
