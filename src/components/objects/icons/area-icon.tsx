import * as React from "react";
import { IconBase } from "./icon-base";
import type { ObjectIconProps } from "./types";

export const AreaIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function AreaIcon(props, ref) {
    return (
      <IconBase ref={ref} data-icon="area" {...props}>
        <path
          fill="currentColor"
          d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"
        />
      </IconBase>
    );
  },
);

AreaIcon.displayName = "AreaIcon";
export const ObjectAreaIcon = AreaIcon;
