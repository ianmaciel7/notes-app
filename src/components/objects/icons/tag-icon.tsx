import * as React from "react";
import type { ObjectIconProps } from "../../../lib/space-object-types";
import { IconBase } from "./icon-base";

export const TagIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function TagIcon(props, ref) {
    return (
      <IconBase ref={ref} data-icon="tag" {...props}>
        <path
          fill="currentColor"
          d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"
        />
      </IconBase>
    );
  },
);

TagIcon.displayName = "TagIcon";
export const ObjectTagIcon = TagIcon;
