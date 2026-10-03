import type { ComponentProps } from "react";
import { CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionCardDescriptionProps = ComponentProps<typeof CardDescription>;

function QuestionCardDescription({
  className,
  children,
  ...props
}: QuestionCardDescriptionProps) {
  return (
    <CardDescription
      data-slot="question-card-description"
      {...props}
      className={cn("text-xs text-muted-foreground", className)}
    >
      {children}
    </CardDescription>
  );
}

export { QuestionCardDescription, type QuestionCardDescriptionProps };
