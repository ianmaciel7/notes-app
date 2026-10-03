"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionOrderingItemProps = Omit<
  ComponentProps<typeof Item>,
  "children"
> & {
  item: QuestionItem;
  index: number;
  total: number;
  resolved: boolean;
  isCorrect?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

function QuestionOrderingItem({
  item,
  index,
  total,
  resolved,
  isCorrect,
  onMoveUp,
  onMoveDown,
  className,
  ...props
}: QuestionOrderingItemProps) {
  const status = resolved ? (isCorrect ? "correct" : "incorrect") : undefined;

  return (
    <Item
      data-slot="question-ordering-item"
      data-status={status}
      variant="outline"
      {...props}
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border-border bg-card p-3 shadow-xs transition-colors",
        status === "correct" && "border-primary bg-primary/10",
        status === "incorrect" && "border-destructive bg-destructive/10",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-foreground">{item.text}</span>
      </div>

      <div className="flex items-center gap-1">
        {status ? <QuestionResultBadge state={status} /> : null}

        {!resolved ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={index === 0}
              onClick={onMoveUp}
              aria-label={`Move ${item.text} up`}
            >
              <ArrowUpIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={index === total - 1}
              onClick={onMoveDown}
              aria-label={`Move ${item.text} down`}
            >
              <ArrowDownIcon className="size-4" />
            </Button>
          </>
        ) : null}
      </div>
    </Item>
  );
}

export { QuestionOrderingItem, type QuestionOrderingItemProps };
