"use client";

import type { ComponentProps } from "react";
import { useId } from "react";
import { QuestionChoiceItem } from "@/components/notes-app/question-choice-item";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/question";

type QuestionChoiceGroupProps = Omit<
  ComponentProps<typeof FieldSet>,
  "children" | "onChange"
> & {
  /** Accessible name of the group (the prompt). */
  legend: string;
  /** `single` renders radio buttons, `multiple` renders checkboxes. */
  mode: "single" | "multiple";
  options: QuestionOption[];
  value: readonly string[];
  /** The key, used to mark options once `resolved`. */
  correctIds: readonly string[];
  resolved: boolean;
  onValueChange: (ids: string[]) => void;
};

function resultFor(
  resolved: boolean,
  selected: boolean,
  isKey: boolean,
): "correct" | "incorrect" | undefined {
  if (!resolved) return undefined;
  if (isKey) return "correct";
  return selected ? "incorrect" : undefined;
}

function QuestionChoiceGroup({
  legend,
  mode,
  options,
  value,
  correctIds,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionChoiceGroupProps) {
  const groupId = useId();

  const items = options.map((option, index) => {
    const selected = value.includes(option.id);
    return (
      <QuestionChoiceItem
        key={option.id}
        option={option}
        marker={String.fromCharCode(65 + index)}
        mode={mode}
        inputId={`${groupId}-${option.id}`}
        selected={selected}
        result={resultFor(resolved, selected, correctIds.includes(option.id))}
        onSelectedChange={(checked) =>
          onValueChange(
            checked
              ? [...value, option.id]
              : value.filter((id) => id !== option.id),
          )
        }
      />
    );
  });

  return (
    <FieldSet
      data-slot="question-choice-group"
      {...props}
      className={cn("min-w-0 gap-2", className)}
    >
      <FieldLegend className="sr-only">{legend}</FieldLegend>
      {mode === "single" ? (
        <RadioGroup
          value={value[0] ?? ""}
          readOnly={resolved}
          onValueChange={(next) => onValueChange([String(next)])}
        >
          {items}
        </RadioGroup>
      ) : (
        <div className="grid w-full gap-2">{items}</div>
      )}
    </FieldSet>
  );
}

export { QuestionChoiceGroup, type QuestionChoiceGroupProps };
