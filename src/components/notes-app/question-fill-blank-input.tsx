"use client";

import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type QuestionFillBlankInputProps = Omit<
  ComponentProps<"input">,
  "children" | "onChange" | "type"
> & {
  value: string;
  resolved: boolean;
  onValueChange: (value: string) => void;
};

function QuestionFillBlankInput({
  value,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionFillBlankInputProps) {
  return (
    <Input
      data-slot="question-fill-blank-input"
      type="text"
      {...props}
      value={value}
      onChange={(e) => onValueChange(e.currentTarget.value)}
      disabled={resolved}
      className={cn("flex-1", className)}
    />
  );
}

export { QuestionFillBlankInput, type QuestionFillBlankInputProps };
