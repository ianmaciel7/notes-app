"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionDraggableItem } from "@/components/notes-app/question-draggable-item";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionPoolFieldProps = Omit<ComponentProps<typeof Field>, "children"> & {
  items: QuestionItem[];
  isOver: boolean;
  resolved: boolean;
  setNodeRef: (element: HTMLElement | null) => void;
};

function QuestionPoolField({
  items,
  isOver,
  resolved,
  setNodeRef,
  className,
  ...props
}: QuestionPoolFieldProps) {
  const t = useTranslations("exam");
  return (
    <Field
      data-slot="question-pool-field"
      data-over={isOver || undefined}
      ref={setNodeRef}
      {...props}
      className={cn(
        "flex min-h-40 flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3 transition-colors data-[over]:border-primary data-[over]:bg-primary/5 data-[over]:ring-2 data-[over]:ring-primary/20",
        className
      )}
    >
      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-xs text-muted-foreground">{t("dragPoolEmpty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <QuestionDraggableItem
              key={item.id}
              item={item}
              disabled={resolved}
              className="w-full justify-start shadow-xs hover:border-primary/50"
            />
          ))}
        </div>
      )}
    </Field>
  );
}

export { QuestionPoolField, type QuestionPoolFieldProps };
