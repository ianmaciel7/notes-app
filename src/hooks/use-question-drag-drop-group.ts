"use client";

import {
  type Announcements,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { QuestionItem, QuestionSlot } from "@/types/question";

/** Droppable id of the list of items that are not in a slot. */
export const DRAG_POOL_ID = "pool";

export type UseQuestionDragDropGroupOptions = {
  items: QuestionItem[];
  slots: QuestionSlot[];
  /** slotId -> itemId placed so far. */
  value: Readonly<Record<string, string>>;
  onValueChange: (next: Record<string, string>) => void;
};

export function useQuestionDragDropGroup({
  items,
  slots,
  value,
  onValueChange,
}: UseQuestionDragDropGroupOptions) {
  const t = useTranslations("exam");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const placedIds = new Set(Object.values(value));
  const poolItems = items.filter((item) => !placedIds.has(item.id));

  const itemText = (id: string | number) =>
    items.find((item) => item.id === id)?.text ?? String(id);
  const targetText = (id: string | number | undefined) =>
    slots.find((slot) => slot.id === id)?.label ?? t("dragPoolTarget");

  /** Puts an item into a slot (or back to the pool); an item sits in one place only. */
  const placeItem = (itemId: string, slotId: string | null) => {
    const next: Record<string, string> = {};
    for (const [slot, placed] of Object.entries(value)) {
      if (placed !== itemId && slot !== slotId) next[slot] = placed;
    }
    if (slotId !== null && itemId !== "") next[slotId] = itemId;
    onValueChange(next);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const itemId = String(active.id);
    placeItem(itemId, over.id === DRAG_POOL_ID ? null : String(over.id));
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      t("dragAnnouncePickup", { item: itemText(active.id) }),
    onDragOver: ({ active, over }) =>
      t("dragAnnounceOver", {
        item: itemText(active.id),
        target: targetText(over?.id),
      }),
    onDragEnd: ({ active, over }) =>
      t("dragAnnounceDrop", {
        item: itemText(active.id),
        target: targetText(over?.id),
      }),
    onDragCancel: ({ active }) =>
      t("dragAnnounceCancel", { item: itemText(active.id) }),
  };

  return {
    sensors,
    accessibility: {
      announcements,
      screenReaderInstructions: { draggable: t("dragInstructions") },
    },
    poolItems,
    placeItem,
    handleDragEnd,
  };
}
