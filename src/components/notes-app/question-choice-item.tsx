"use client";

import type { ComponentProps } from "react";
import { QuestionImageItem } from "@/components/notes-app/question-image-item";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/question";

type QuestionChoiceItemProps = Omit<
  ComponentProps<typeof FieldLabel>,
  "children" | "htmlFor"
> & {
  option: QuestionOption;
  /** Letter shown before the option text (A, B, ...). */
  marker: string;
  mode: "single" | "multiple";
  inputId: string;
  selected: boolean;
  /** Set once graded: the key option, or a wrong pick. */
  result?: "correct" | "incorrect";
  onSelectedChange?: (selected: boolean) => void;
};

function QuestionChoiceItem({
  option,
  marker,
  mode,
  inputId,
  selected,
  result,
  onSelectedChange,
  className,
  ...props
}: QuestionChoiceItemProps) {
  // `result` is only set once graded, for the key and for a wrong pick.
  const showExplanation = result !== undefined;

  return (
    <FieldLabel
      data-slot="question-choice-item"
      data-result={result}
      htmlFor={inputId}
      {...props}
      className={cn(
        "cursor-pointer rounded-lg border border-border font-normal hover:bg-muted/50 data-[result=correct]:border-primary data-[result=correct]:bg-primary/10 data-[result=incorrect]:border-destructive data-[result=incorrect]:bg-destructive/10 [&_[data-slot=checkbox]:not([data-checked])]:bg-background [&_[data-slot=radio-group-item]:not([data-checked])]:bg-background",
        className,
      )}
    >
      <Field orientation="horizontal">
        {mode === "single" ? (
          <RadioGroupItem value={option.id} id={inputId} />
        ) : (
          <Checkbox
            id={inputId}
            checked={selected}
            onCheckedChange={(checked) => onSelectedChange?.(checked)}
          />
        )}
        <FieldContent>
          <FieldTitle className="items-start">
            <span className="font-semibold">{marker}.</span>
            <span>{option.text}</span>
          </FieldTitle>
          {option.imageUrl ? (
            <QuestionImageItem
              url={option.imageUrl}
              alt={option.imageAlt ?? option.text}
              className="mt-2 max-w-xs"
            />
          ) : null}
          {showExplanation && option.explanation ? (
            <FieldDescription>{option.explanation}</FieldDescription>
          ) : null}
        </FieldContent>
        {result ? <QuestionResultBadge state={result} /> : null}
      </Field>
    </FieldLabel>
  );
}

export { QuestionChoiceItem, type QuestionChoiceItemProps };
