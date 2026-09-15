import * as React from "react";
import type { ObjectIconProps } from "@/lib/object";
import { ObjectIcon } from "./object-icon";

export const TableIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function TableIcon(props, ref) {
    return (
      <ObjectIcon ref={ref} data-icon="table" {...props}>
        <path
          fill="currentColor"
          d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"
        />
      </ObjectIcon>
    );
  },
);

TableIcon.displayName = "TableIcon";
export const ObjectTableIcon = TableIcon;
