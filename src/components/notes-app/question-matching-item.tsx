"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useId } from "react";
import { QuestionImageFigure } from "@/components/notes-app/question-image-figure";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { QuestionItem } from "@/types/question";

type QuestionMatchingItemProps = Omit<
  ComponentProps<typeof Field>,
  "children" | "onChange"
> & {
  item: QuestionItem;
  rightItems: QuestionItem[];
  /** The right item picked for this left item, or "" when none. */
  chosenId: string;
  correctId: string;
  resolved: boolean;
  onChosenChange: (rightId: string) => void;
};

function QuestionMatchingItem({
  item,
  rightItems,
  chosenId,
  correctId,
  resolved,
  onChosenChange,
  ...props
}: QuestionMatchingItemProps) {
  const t = useTranslations("exam");
  const selectId = useId();
  const isCorrect = chosenId === correctId;
  const correctText = rightItems.find((right) => right.id === correctId)?.text;

  const descId = `${selectId}-desc`;

  return (
    <Field
      data-slot="question-matching-item"
      orientation="responsive"
      {...props}
    >
      <FieldContent className="gap-2">
        <FieldLabel htmlFor={selectId}>{item.text}</FieldLabel>
        {item.imageUrl ? (
          <QuestionImageFigure
            url={item.imageUrl}
            alt={item.imageAlt ?? item.text}
            className="max-w-xs"
          />
        ) : null}
        {resolved && !isCorrect ? (
          <FieldDescription id={descId}>
            {t("correctMatch", { match: correctText ?? correctId })}
          </FieldDescription>
        ) : null}
      </FieldContent>
      <div className="flex items-center gap-2">
        <NativeSelect
          id={selectId}
          value={chosenId}
          disabled={resolved}
          aria-label={t("matchLabel", { item: item.text })}
          aria-invalid={resolved && !isCorrect}
          aria-describedby={resolved && !isCorrect ? descId : undefined}
          onChange={(event) => onChosenChange(event.target.value)}
        >
          <NativeSelectOption value="">
            {t("matchPlaceholder")}
          </NativeSelectOption>
          {rightItems.map((right) => (
            <NativeSelectOption key={right.id} value={right.id}>
              {right.text}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {resolved ? (
          <QuestionResultBadge state={isCorrect ? "correct" : "incorrect"} />
        ) : null}
      </div>
    </Field>
  );
}

export { QuestionMatchingItem, type QuestionMatchingItemProps };
