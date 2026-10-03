import type { ComponentProps } from "react";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionCardContentProps = ComponentProps<typeof CardContent>;

function QuestionCardContent({
  className,
  children,
  ...props
}: QuestionCardContentProps) {
  return (
    <CardContent
      data-slot="question-card-content"
      {...props}
      className={cn("flex flex-col gap-4", className)}
    >
      {children}
    </CardContent>
  );
}

export { QuestionCardContent, type QuestionCardContentProps };
