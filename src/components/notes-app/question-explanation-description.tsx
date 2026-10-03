"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { GroundedExplanation } from "@/types/question";

type QuestionExplanationDescriptionProps = Omit<
  ComponentProps<"section">,
  "children"
> & {
  explanation: GroundedExplanation;
};

function QuestionExplanationDescription({
  explanation,
  className,
  ...props
}: QuestionExplanationDescriptionProps) {
  const t = useTranslations("exam");

  return (
    <section
      data-slot="question-explanation-description"
      aria-label={t("explanation")}
      {...props}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4",
        className,
      )}
    >
      <h3 className="text-sm font-semibold text-foreground">
        {t("explanation")}
      </h3>
      <p className="whitespace-pre-wrap text-sm text-foreground">
        {explanation.text}
      </p>
      {explanation.referenceUrls.length > 0 ? (
        <>
          <Separator />
          <h4 className="text-xs font-semibold text-muted-foreground">
            {t("references")}
          </h4>
          <ul className="flex flex-col gap-1 text-xs">
            {explanation.referenceUrls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-primary underline-offset-4 hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export {
  QuestionExplanationDescription,
  type QuestionExplanationDescriptionProps,
};
