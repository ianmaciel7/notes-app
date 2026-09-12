import * as React from "react";
import { IconBase } from "./icon-base";
import type { ObjectIconProps } from "./types";

export const MediaIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function MediaIcon(props, ref) {
    return (
      <IconBase ref={ref} data-icon="media" {...props}>
        <path
          fill="currentColor"
          d="M216,64H147.31l34.35-34.34a8,8,0,1,0-11.32-11.32L128,60.69,85.66,18.34A8,8,0,0,0,74.34,29.66L108.69,64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64M40,80H144V200H40Zm176,120H160V80h56Zm-16-84a12,12,0,1,1-12-12a12,12,0,0,1,12,12m0,48a12,12,0,1,1-12-12a12,12,0,0,1,12,12"
        />
      </IconBase>
    );
  },
);

MediaIcon.displayName = "MediaIcon";
export const ObjectMediaIcon = MediaIcon;
