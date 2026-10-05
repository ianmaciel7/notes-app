"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import type { GroundedExplanation } from "@/types/question";

type QuestionExplanationFieldDescriptionProps = Omit<
  ComponentProps<"div">,
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
    <div
      data-slot="question-explanation-field-description"
      {...props}
      className={cn(
        "flex flex-col gap-2 text-left text-sm leading-normal font-normal text-muted-foreground",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
    >
      <div className="whitespace-pre-wrap text-sm text-foreground">
        {explanation.text}
      </div>
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
    </div>
  );
}

export {
  QuestionExplanationFieldDescription,
  type QuestionExplanationFieldDescriptionProps,
};
