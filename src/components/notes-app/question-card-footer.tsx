import type { ComponentProps } from "react";
import { CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionCardFooterProps = ComponentProps<typeof CardFooter>;

function QuestionCardFooter({
  className,
  children,
  ...props
}: QuestionCardFooterProps) {
  return (
    <CardFooter
      data-slot="question-card-footer"
      {...props}
      className={cn("gap-2", className)}
    >
      {children}
    </CardFooter>
  );
}

export { QuestionCardFooter, type QuestionCardFooterProps };
