"use client";

import {
  CheckCircle2Icon,
  GripVerticalIcon,
  RotateCcwIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DragAndDropItem, DragAndDropSlot } from "@/types/question";

interface DndQuestionProps {
  slots?: DragAndDropSlot[];
  items?: DragAndDropItem[];
  selectedAnswer?: Record<string, string>;
  onSelectAnswer?: (answer: Record<string, string>) => void;
  isRevealed?: boolean;
  correctAnswer?: Record<string, string>;
  disabled?: boolean;
}

export function DndQuestion({
  slots = [],
  items = [],
  selectedAnswer = {},
  onSelectAnswer,
  isRevealed = false,
  correctAnswer = {},
  disabled = false,
}: DndQuestionProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Items currently assigned to any slot
  const assignedItemIds = new Set(Object.values(selectedAnswer));

  // Items available in the source pool
  const availableItems = items.filter((item) => !assignedItemIds.has(item.id));

  const handleAssign = (slotId: string, itemId: string) => {
    if (disabled || isRevealed || !onSelectAnswer) return;
    const next = { ...selectedAnswer };

    // If item was previously assigned to another slot, remove it from that slot
    for (const [sId, iId] of Object.entries(next)) {
      if (iId === itemId) {
        delete next[sId];
      }
    }

    next[slotId] = itemId;
    onSelectAnswer(next);
    setSelectedItemId(null);
  };

  const handleRemove = (slotId: string) => {
    if (disabled || isRevealed || !onSelectAnswer) return;
    const next = { ...selectedAnswer };
    delete next[slotId];
    onSelectAnswer(next);
  };

  const handleClearAll = () => {
    if (disabled || isRevealed || !onSelectAnswer) return;
    onSelectAnswer({});
    setSelectedItemId(null);
  };

  const getItemById = (id: string) => items.find((i) => i.id === id);

  return (
    <div className="space-y-6">
      {/* Available Items Pool */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            Available Options ({availableItems.length} remaining)
          </span>
          {!disabled &&
            !isRevealed &&
            Object.keys(selectedAnswer).length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleClearAll}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <RotateCcwIcon className="size-3" />
                Reset All
              </Button>
            )}
        </div>

        {availableItems.length === 0 ? (
          <p className="py-2 text-center text-xs text-muted-foreground italic">
            All items placed. Click any placed item or slot to adjust.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {availableItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  draggable={!disabled && !isRevealed}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.id);
                  }}
                  onClick={() => {
                    if (disabled || isRevealed) return;
                    setSelectedItemId(isSelected ? null : item.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedItemId(isSelected ? null : item.id);
                    }
                  }}
                  tabIndex={disabled || isRevealed ? -1 : 0}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex cursor-grab items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-card-foreground shadow-xs transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
                    isSelected &&
                      "border-primary bg-primary/10 ring-2 ring-primary",
                    (disabled || isRevealed) && "cursor-default opacity-70",
                  )}
                >
                  <GripVerticalIcon className="size-3.5 text-muted-foreground" />
                  <span>{item.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {selectedItemId && (
          <p className="mt-2 text-xs text-primary font-medium animate-pulse">
            Tip: Click a target slot below to place the selected item.
          </p>
        )}
      </div>

      {/* Target Slots List */}
      <div className="grid gap-3">
        <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
          Target Slots &amp; Placements
        </span>

        {slots.map((slot) => {
          const placedItemId = selectedAnswer[slot.id];
          const placedItem = placedItemId ? getItemById(placedItemId) : null;
          const expectedItemId = correctAnswer[slot.id];
          const expectedItem = expectedItemId
            ? getItemById(expectedItemId)
            : null;

          const isCorrect =
            isRevealed && placedItemId && placedItemId === expectedItemId;
          const isWrong =
            isRevealed && (!placedItemId || placedItemId !== expectedItemId);

          let slotBorder = "border-border";
          if (isCorrect) {
            slotBorder = "border-emerald-600 bg-emerald-500/10";
          } else if (isWrong) {
            slotBorder = "border-destructive bg-destructive/10";
          } else if (selectedItemId) {
            slotBorder =
              "border-dashed border-primary/70 hover:bg-primary/5 cursor-pointer";
          }

          return (
            <section
              key={slot.id}
              aria-label={`Drop target for ${slot.label}`}
              onDragOver={(e) => {
                if (!disabled && !isRevealed) {
                  e.preventDefault();
                }
              }}
              onDrop={(e) => {
                if (disabled || isRevealed) return;
                e.preventDefault();
                const itemId = e.dataTransfer.getData("text/plain");
                if (itemId) {
                  handleAssign(slot.id, itemId);
                }
              }}
              className={cn(
                "relative flex flex-col gap-2 rounded-lg border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between",
                slotBorder,
              )}
            >
              {/* Slot Label */}
              <div className="flex items-center gap-2 sm:max-w-[45%]">
                <span className="font-medium text-sm text-foreground">
                  {slot.label}
                </span>
              </div>

              {/* Slot Drop Target / Placed Item */}
              <div className="flex flex-1 items-center justify-end gap-2">
                {placedItem ? (
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium",
                      isCorrect
                        ? "border-emerald-600 bg-emerald-600/15 text-emerald-950 dark:text-emerald-100"
                        : isWrong
                          ? "border-destructive bg-destructive/15 text-destructive-foreground"
                          : "border-primary/50 bg-primary/10 text-foreground",
                    )}
                  >
                    <span>{placedItem.text}</span>
                    {!disabled && !isRevealed && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(slot.id);
                        }}
                        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Remove ${placedItem.text} from ${slot.label}`}
                      >
                        <XIcon className="size-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!selectedItemId || disabled || isRevealed}
                    onClick={() => {
                      if (selectedItemId && !disabled && !isRevealed) {
                        handleAssign(slot.id, selectedItemId);
                      }
                    }}
                    className="flex h-8 items-center rounded-md border border-dashed border-muted-foreground/40 px-3 text-xs text-muted-foreground disabled:cursor-default"
                  >
                    {selectedItemId
                      ? "Click to place selected item"
                      : "Drop item here"}
                  </button>
                )}

                {/* Status Badges on Reveal */}
                {isRevealed && isCorrect && (
                  <Badge className="gap-1 border-emerald-600 bg-emerald-600 text-white">
                    <CheckCircle2Icon className="size-3.5" />
                    Correct
                  </Badge>
                )}

                {isRevealed && isWrong && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircleIcon className="size-3.5" />
                    Incorrect
                  </Badge>
                )}
              </div>

              {/* Show Expected item if wrong and revealed */}
              {isRevealed && isWrong && expectedItem && (
                <div className="w-full text-right text-xs text-emerald-600 dark:text-emerald-400 font-medium sm:w-auto">
                  Correct answer: {expectedItem.text}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
