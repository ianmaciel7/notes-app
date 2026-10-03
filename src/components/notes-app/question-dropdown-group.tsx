"use client";

import { useTranslations } from "next-intl";
import { type ComponentProps, useId } from "react";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { QuestionDropdownField } from "@/types/question";

interface QuestionDropdownGroupProps
  extends Omit<ComponentProps<typeof FieldSet>, "children" | "onChange"> {
  legend: string;
  dropdowns: QuestionDropdownField[];
  value: Record<string, string>;
  correctAnswer: Record<string, string>;
  resolved: boolean;
  onValueChange: (value: Record<string, string>) => void;
}

function QuestionDropdownGroup({
  legend,
  dropdowns,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionDropdownGroupProps) {
  const t = useTranslations("exam");
  const groupId = useId();

  return (
    <FieldSet
      data-slot="question-dropdown-group"
      {...props}
      className={cn("min-w-0 gap-4", className)}
    >
      <FieldLegend className="sr-only">{legend}</FieldLegend>
      <div className="flex flex-col gap-3">
        {dropdowns.map((dropdown, index) => {
          const selected = value[dropdown.id] ?? "";
          const isCorrect = resolved && selected === correctAnswer[dropdown.id];
          const isIncorrect = resolved && selected !== "" && !isCorrect;
          const status = isCorrect
            ? "correct"
            : isIncorrect
              ? "incorrect"
              : undefined;

          return (
            <Field
              key={dropdown.id}
              data-slot="question-dropdown-item"
              data-status={status}
              className={cn(
                "rounded-lg border border-border p-3 transition-colors",
                status === "correct" && "border-primary bg-primary/10",
                status === "incorrect" &&
                  "border-destructive bg-destructive/10",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <FieldLabel
                  htmlFor={`${groupId}-${dropdown.id}`}
                  className="text-sm font-medium"
                >
                  {dropdown.label || `Part ${index + 1}`}
                </FieldLabel>
                {status ? <QuestionResultBadge state={status} /> : null}
              </div>
              <FieldContent>
                <Select
                  disabled={resolved}
                  value={selected}
                  onValueChange={(next) =>
                    onValueChange({
                      ...value,
                      [dropdown.id]: String(next),
                    })
                  }
                >
                  <SelectTrigger
                    id={`${groupId}-${dropdown.id}`}
                    className="w-full"
                    data-slot="question-dropdown-trigger"
                  >
                    <SelectValue placeholder={t("dropdownPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdown.options.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          );
        })}
      </div>
    </FieldSet>
  );
}

export { QuestionDropdownGroup, type QuestionDropdownGroupProps };
