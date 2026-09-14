import * as React from "react";
import type { ObjectIconProps } from "../../../lib/space-object-types";
import { ObjectIcon } from "./object-icon";

export const FileIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function FileIcon(props, ref) {
    return (
      <ObjectIcon ref={ref} data-icon="file" {...props}>
        <path
          fill="currentColor"
          d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"
        />
      </ObjectIcon>
    );
  },
);

FileIcon.displayName = "FileIcon";
export const ObjectFileIcon = FileIcon;
