import * as React from "react";
import type { ObjectIconProps } from "@/lib/object";
import { ObjectIcon } from "./object-icon";

export const AreaIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function AreaIcon(props, ref) {
    return (
      <ObjectIcon ref={ref} data-icon="area" {...props}>
        <path
          fill="currentColor"
          d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"
        />
      </ObjectIcon>
    );
  },
);

AreaIcon.displayName = "AreaIcon";
export const ObjectAreaIcon = AreaIcon;
