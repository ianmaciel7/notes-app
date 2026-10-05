import type { ComponentProps } from "react";
import { CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionCardHeaderProps = ComponentProps<typeof CardHeader>;

function QuestionCardHeader({
  className,
  children,
  ...props
}: QuestionCardHeaderProps) {
  return (
    <CardHeader
      data-slot="question-card-header"
      {...props}
      className={cn(
        "border-b border-border bg-muted/50 pt-(--card-spacing)",
        className
      )}
    >
      {children}
    </CardHeader>
  );
}

export { QuestionCardHeader, type QuestionCardHeaderProps };
