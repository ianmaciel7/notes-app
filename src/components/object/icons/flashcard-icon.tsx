import * as React from "react";
import type { ObjectIconProps } from "@/lib/object";
import { ObjectIcon } from "./object-icon";

export const FlashcardIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function FlashcardIcon(props, ref) {
    return (
      <ObjectIcon ref={ref} data-icon="flashcard" {...props}>
        <path
          fill="currentColor"
          d="M76,36H200a20,20,0,0,1,20,20V160a20,20,0,0,1-20,20H184V164H200a4,4,0,0,0,4-4V56a4,4,0,0,0-4-4H76a4,4,0,0,0-4,4V72H56V56A20,20,0,0,1,76,36Z"
        />
        <path
          fill="currentColor"
          d="M48,76H172a20,20,0,0,1,20,20V200a20,20,0,0,1-20,20H48a20,20,0,0,1-20-20V96A20,20,0,0,1,48,76Zm0,16a4,4,0,0,0-4,4V200a4,4,0,0,0,4,4H172a4,4,0,0,0,4-4V96a4,4,0,0,0-4-4H48Zm24,40a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H80A8,8,0,0,1,72,132Zm0,36a8,8,0,0,1,8-8h56a8,8,0,0,1,0,16H80A8,8,0,0,1,72,168Z"
        />
      </ObjectIcon>
    );
  },
);

FlashcardIcon.displayName = "FlashcardIcon";
export const ObjectFlashcardIcon = FlashcardIcon;
