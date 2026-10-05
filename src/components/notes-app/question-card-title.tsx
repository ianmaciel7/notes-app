import type { ComponentProps } from "react";
import { CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionCardTitleProps = ComponentProps<typeof CardTitle>;

function QuestionCardTitle({
  className,
  children,
  ...props
}: QuestionCardTitleProps) {
  return (
    <CardTitle
      data-slot="question-card-title"
      {...props}
      className={cn(
        "flex items-center justify-between gap-2 text-sm font-semibold text-foreground",
        className
      )}
    >
      {children}
    </CardTitle>
  );
}

export { QuestionCardTitle, type QuestionCardTitleProps };
