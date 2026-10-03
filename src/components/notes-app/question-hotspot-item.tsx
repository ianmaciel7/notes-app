"use client";

import type { ComponentProps } from "react";
import { Toggle } from "@/components/ui/toggle";
import { areaBox, areaClipPath } from "@/lib/exam/hotspot-geometry";
import { cn } from "@/lib/utils";
import type { HotspotArea } from "@/types/question";

type QuestionHotspotItemProps = Omit<
  ComponentProps<typeof Toggle>,
  "children" | "aria-label" | "render" | "style"
> & {
  area: HotspotArea;
  /** Set once graded: right pick, wrong pick, or a key area left unselected. */
  result?: "correct" | "incorrect" | "missed";
};

/**
 * A clickable region over the image, placed by the area's bounding box and cut
 * to its shape. It is a toggle button, so it is focusable and announced as
 * pressed or not without any extra ARIA.
 */
function QuestionHotspotItem({
  area,
  result,
  className,
  ...props
}: QuestionHotspotItemProps) {
  const box = areaBox(area.shape);

  return (
    <Toggle
      data-slot="question-hotspot-item"
      data-result={result}
      data-shape={area.shape.kind}
      {...props}
      aria-label={area.label}
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
        clipPath: areaClipPath(area.shape),
      }}
      className={cn(
        "absolute min-w-0 border-2 border-dashed border-border bg-transparent p-0 data-[shape=circle]:rounded-full data-[shape=polygon]:border-0 data-pressed:border-solid data-pressed:border-primary data-pressed:bg-primary/20 focus-visible:bg-ring/30 data-[result=correct]:border-solid data-[result=correct]:border-primary data-[result=correct]:bg-primary/25 data-[result=incorrect]:border-destructive data-[result=incorrect]:bg-destructive/25 data-[result=missed]:border-primary data-[result=missed]:bg-primary/10",
        className,
      )}
    />
  );
}

export { QuestionHotspotItem, type QuestionHotspotItemProps };
