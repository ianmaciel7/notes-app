"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ComponentProps } from "react";
import { useId } from "react";
import { QuestionPoolField } from "@/components/notes-app/question-pool-field";
import { QuestionSlotField } from "@/components/notes-app/question-slot-field";
import type { Field } from "@/components/ui/field";
import type {
  QuestionDropField as QuestionDropFieldType,
  QuestionItem,
} from "@/types/question";

type QuestionDroppableFieldProps = Omit<
  ComponentProps<typeof Field>,
  "children" | "onChange"
> & {
  field?: QuestionDropFieldType;
  isPool?: boolean;
  items: QuestionItem[];
  placedId?: string;
  correctId?: string;
  resolved?: boolean;
  onPlace?: (itemId: string) => void;
};

function QuestionDroppableField({
  field,
  isPool = false,
  items,
  placedId = "",
  correctId = "",
  resolved = false,
  onPlace,
  className,
  ...props
}: QuestionDroppableFieldProps) {
  const droppableId = isPool ? "pool" : (field?.id ?? "pool");
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });
  const selectId = useId();

  if (isPool) {
    return (
      <QuestionPoolField
        data-slot="question-droppable-field"
        {...props}
        className={className}
        items={items}
        isOver={isOver}
        resolved={resolved}
        setNodeRef={setNodeRef}
      />
    );
  }

  return (
    <QuestionSlotField
      data-slot="question-droppable-field"
      {...props}
      className={className}
      correctId={correctId}
      field={field}
      items={items}
      isOver={isOver}
      onPlace={onPlace}
      placedId={placedId}
      resolved={resolved}
      selectId={selectId}
      setNodeRef={setNodeRef}
    />
  );
}

export { QuestionDroppableField, type QuestionDroppableFieldProps };
