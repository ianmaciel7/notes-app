"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";

type QuestionResultBadgeProps = Omit<
  ComponentProps<typeof Badge>,
  "children" | "variant"
> & {
  state: "correct" | "incorrect";
};

/** Text plus icon, so a result never depends on color alone. */
function QuestionResultBadge({ state, ...props }: QuestionResultBadgeProps) {
  const t = useTranslations("exam");
  const Icon = state === "correct" ? CheckIcon : XIcon;

  return (
    <Badge
      data-slot="question-result-badge"
      data-state={state}
      variant={state === "correct" ? "default" : "destructive"}
      {...props}
    >
      <Icon aria-hidden="true" data-icon="inline-start" />
      {t(state)}
    </Badge>
  );
}

export { QuestionResultBadge, type QuestionResultBadgeProps };
