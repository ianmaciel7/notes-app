"use client";

import type { ComponentProps } from "react";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { GroundedExplanation } from "@/types/question";

type QuestionExplanationFieldDescriptionProps = Omit<
  ComponentProps<typeof FieldDescription>,
  "children"
> & {
  explanation: GroundedExplanation;
};

function QuestionExplanationFieldDescription({
  explanation,
  className,
  ...props
}: QuestionExplanationFieldDescriptionProps) {
  return (
    <FieldDescription
      data-slot="question-explanation-field-description"
      {...props}
      className={cn("flex flex-col gap-2", className)}
    >
      <p className="whitespace-pre-wrap text-sm text-foreground">
        {explanation.text}
      </p>
      {explanation.referenceUrls.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {explanation.referenceUrls.map((url) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-xs text-primary underline hover:no-underline"
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </FieldDescription>
  );
}

export {
  QuestionExplanationFieldDescription,
  type QuestionExplanationFieldDescriptionProps,
};
