"use client";

import { type ComponentProps, useId } from "react";
import { QuestionDropdownField } from "@/components/notes-app/question-dropdown-field";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { QuestionDropdownField as QuestionDropdownFieldType } from "@/types/question";

type QuestionDropdownFieldSetProps = Omit<
  ComponentProps<typeof FieldGroup>,
  "children" | "onChange"
> & {
  legend: string;
  dropdowns: QuestionDropdownFieldType[];
  /** dropdownId -> selected optionId. */
  value: Readonly<Record<string, string>>;
  /** dropdownId -> correct optionId. */
  correctAnswer: Readonly<Record<string, string>>;
  resolved: boolean;
  onValueChange: (next: Record<string, string>) => void;
};

function QuestionDropdownFieldSet({
  legend,
  dropdowns,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionDropdownFieldSetProps) {
  const groupId = useId();

  return (
    <FieldGroup
      data-slot="question-dropdown-field-set"
      aria-label={legend}
      {...props}
      className={cn("min-w-0 gap-3", className)}
    >
      {dropdowns.map((dropdown, index) => (
        <QuestionDropdownField
          key={dropdown.id}
          dropdown={dropdown}
          value={value[dropdown.id] ?? ""}
          correctAnswer={correctAnswer[dropdown.id]}
          resolved={resolved}
          index={index}
          inputId={`${groupId}-${dropdown.id}`}
          onValueChange={(selected) => {
            onValueChange({
              ...value,
              [dropdown.id]: selected,
            });
          }}
        />
      ))}
    </FieldGroup>
  );
}

export { QuestionDropdownFieldSet, type QuestionDropdownFieldSetProps };
